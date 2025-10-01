const formatResponse = require("../utils/formatResponse");
const { TgOrder, TgUser, Product, User } = require("../db/models");
const { sequelize } = require("../db/models");
const NotificationService = require("../services/notificationService");

class OrderController {
  // Создание или поиск TgUser для веб-пользователя
  static async findOrCreateTgUser(userId, user, transaction) {
    const tgUserId = userId.toString();

    // Ищем существующего TgUser
    let tgUser = await TgUser.findOne({
      where: { tg_user_id: tgUserId },
      transaction,
    });

    // Если не найден, создаем нового
    if (!tgUser) {
      tgUser = await TgUser.create(
        {
          tg_user_id: tgUserId,
          tg_username: null,
          first_name: user.login,
          last_name: user.email || null,
          phone: user.phone || null,
        },
        { transaction }
      );
    }

    return tgUser;
  }

  // Создание заказа через веб-интерфейс
  static async createOrder(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { items, user_comment } = req.body;
      const userId = res.locals.user.id; // Получаем ID пользователя из JWT токена

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json(
            formatResponse(400, "Необходимо указать товары для заказа", null)
          );
      }

      // Получаем информацию о пользователе
      const user = await User.findByPk(userId, {
        include: ["role"],
        transaction,
      });

      if (!user) {
        await transaction.rollback();
        return res
          .status(404)
          .json(formatResponse(404, "Пользователь не найден", null));
      }

      // Создаем или находим TgUser для веб-пользователя
      const tgUser = await OrderController.findOrCreateTgUser(
        userId,
        user,
        transaction
      );

      const createdOrders = [];
      let totalPrice = 0;

      // Используем текущее время для группировки товаров в один заказ
      const orderTimestamp = new Date();
      // Округляем до секунды для группировки
      orderTimestamp.setMilliseconds(0);

      // Создаем заказы для каждого товара
      for (const item of items) {
        const {
          product_id,
          quantity,
          variant,
          user_comment: itemComment,
        } = item;

        if (!product_id || !quantity || quantity <= 0) {
          continue; // Пропускаем некорректные товары
        }

        // Проверяем существование продукта
        const product = await Product.findByPk(product_id, {
          where: { is_active: true },
          transaction,
        });

        if (!product) {
          continue; // Пропускаем неактивные товары
        }

        // Создаем заказ в таблице tg_orders
        const order = await TgOrder.create(
          {
            tg_user_id: tgUser.tg_user_id,
            product_id: product_id,
            quantity: quantity,
            variant: variant || null,
            user_comment: itemComment || user_comment || null,
            status: "pending",
            createdAt: orderTimestamp,
            updatedAt: orderTimestamp,
          },
          { transaction }
        );

        const itemPrice = product.price * quantity;
        totalPrice += itemPrice;

        createdOrders.push({
          id: order.id,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
          },
          quantity: quantity,
          variant: variant,
          total_price: itemPrice,
        });
      }

      if (createdOrders.length === 0) {
        await transaction.rollback();
        return res
          .status(400)
          .json(
            formatResponse(400, "Не удалось создать ни одного заказа", null)
          );
      }

      await transaction.commit();

      // Отправляем уведомление админам в Telegram
      try {
        const adminIds = await NotificationService.getAdminTelegramIds();
        const orderIds = createdOrders.map((order) => order.id);

        for (const adminId of adminIds) {
          // Используем setTimeout для асинхронной отправки уведомлений
          // Это предотвращает блокировку основного потока
          setTimeout(async () => {
            try {
              await NotificationService.notifyAdminBulkOrder(
                null, // bot будет получен из NotificationService
                orderIds,
                adminId,
                {
                  user_name: user.login,
                  user_email: user.email || "Не указан",
                  user_phone: user.phone || "Не указан",
                  total_price: totalPrice,
                  items_count: createdOrders.length,
                }
              );
            } catch (error) {
              console.error("Ошибка отправки уведомления (асинхронно):", error);
            }
          }, 100); // Небольшая задержка для избежания конфликтов
        }

        console.log(
          `📧 Веб-заказ создан: ${createdOrders.length} товаров, сумма: ${totalPrice}₽`
        );
      } catch (notificationError) {
        console.error("Ошибка отправки уведомления:", notificationError);
        // Не прерываем выполнение из-за ошибки уведомления
      }

      // Получаем обновленный список заказов для определения правильного порядкового номера
      const updatedOrders = await TgOrder.findAll({
        where: { tg_user_id: tgUser.tg_user_id },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "img"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Группируем заказы по времени (как в getUserOrders)
      const updatedGroupedOrders = {};
      updatedOrders.forEach((order) => {
        const orderTime = new Date(order.createdAt);
        orderTime.setMilliseconds(0);
        const timeKey = orderTime.toISOString();

        if (!updatedGroupedOrders[timeKey]) {
          updatedGroupedOrders[timeKey] = [];
        }
        updatedGroupedOrders[timeKey].push(order);
      });

      // Находим порядковый номер нового заказа
      // Новый заказ получает номер = общее количество заказов
      const totalOrdersCount = Object.keys(updatedGroupedOrders).length;
      const newOrderId = totalOrdersCount;

      const responseData = {
        id: newOrderId, // Возвращаем порядковый номер
        user_id: userId,
        items: createdOrders,
        status: "pending",
        user_comment: user_comment,
        total_price: totalPrice,
        createdAt: new Date(),
      };

      return res.json(
        formatResponse(200, "Заказ создан успешно", responseData)
      );
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка создания заказа:", error);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка создания заказа", null, error.message)
        );
    }
  }

  // Получение заказов пользователя
  static async getUserOrders(req, res) {
    try {
      const userId = res.locals.user.id;
      const user = await User.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json(formatResponse(404, "Пользователь не найден", null));
      }

      const tgUser = await OrderController.findOrCreateTgUser(
        userId,
        user,
        null
      );

      // Получаем заказы пользователя
      const orders = await TgOrder.findAll({
        where: { tg_user_id: tgUser.tg_user_id },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "img"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Группируем заказы по времени создания (с точностью до секунды)
      const groupedOrders = {};
      orders.forEach((order) => {
        const orderTime = new Date(order.createdAt);
        orderTime.setMilliseconds(0);
        const timeKey = orderTime.toISOString();

        if (!groupedOrders[timeKey]) {
          groupedOrders[timeKey] = [];
        }
        groupedOrders[timeKey].push(order);
      });

      // Преобразуем в нужный формат - каждый заказ отдельно
      // Сортируем timeKeys по времени (новые заказы первыми)
      const sortedTimeKeys = Object.keys(groupedOrders).sort((a, b) =>
        b.localeCompare(a)
      );
      const totalOrders = sortedTimeKeys.length;

      const formattedOrders = sortedTimeKeys.map((timeKey, index) => {
        const orderItems = groupedOrders[timeKey];
        const totalPrice = orderItems.reduce(
          (sum, order) =>
            sum + (order.product ? order.product.price * order.quantity : 0),
          0
        );

        // Используем правильный порядковый номер (новые заказы получают большие номера)
        const orderId = totalOrders - index;

        return {
          id: orderId,
          timeKey: timeKey, // Сохраняем оригинальный ключ времени для удаления
          status: orderItems[0].status,
          items: orderItems.map((order) => ({
            product_id: order.product_id,
            quantity: order.quantity,
            variant: order.variant,
            product: order.product
              ? {
                  id: order.product.id,
                  name: order.product.name,
                  price: order.product.price,
                  img: order.product.img,
                }
              : {
                  id: order.product_id,
                  name: `Продукт #${order.product_id}`,
                  price: 0,
                  img: null,
                },
          })),
          total_price: totalPrice,
          user_comment: orderItems[0].user_comment,
          admin_comment: orderItems[0].admin_comment,
          createdAt: orderItems[0].createdAt,
          updatedAt: orderItems[0].updatedAt,
        };
      });

      return res.json(
        formatResponse(200, "Заказы получены успешно", formattedOrders)
      );
    } catch (error) {
      console.error("Ошибка получения заказов:", error);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка получения заказов", null, error.message)
        );
    }
  }

  // Получение заказа по ID
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;

      // Создаем или находим TgUser для веб-пользователя
      const user = await User.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json(formatResponse(404, "Пользователь не найден", null));
      }

      const tgUser = await OrderController.findOrCreateTgUser(
        userId,
        user,
        null
      );

      const order = await TgOrder.findOne({
        where: {
          id: id,
          tg_user_id: tgUser.tg_user_id,
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "img"],
          },
        ],
      });

      if (!order) {
        return res
          .status(404)
          .json(formatResponse(404, "Заказ не найден", null));
      }

      return res.json(formatResponse(200, "Заказ получен успешно", order));
    } catch (error) {
      console.error("Ошибка получения заказа:", error);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка получения заказа", null, error.message)
        );
    }
  }

  // Удаление заказа
  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;

      // Создаем или находим TgUser для веб-пользователя
      const user = await User.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json(formatResponse(404, "Пользователь не найден", null));
      }

      const tgUser = await OrderController.findOrCreateTgUser(
        userId,
        user,
        null
      );

      // Получаем все заказы пользователя для поиска по timeKey
      const allOrders = await TgOrder.findAll({
        where: { tg_user_id: tgUser.tg_user_id },
        order: [["createdAt", "DESC"]],
      });

      // Группируем заказы по времени (как в getUserOrders)
      const groupedOrders = {};
      allOrders.forEach((order) => {
        const orderTime = new Date(order.createdAt);
        orderTime.setMilliseconds(0);
        const timeKey = orderTime.toISOString();

        if (!groupedOrders[timeKey]) {
          groupedOrders[timeKey] = [];
        }
        groupedOrders[timeKey].push(order);
      });

      // Находим заказ по порядковому номеру (ID)
      // Сортируем timeKeys по времени (новые заказы первыми)
      const timeKeys = Object.keys(groupedOrders).sort((a, b) =>
        b.localeCompare(a)
      );
      const totalOrders = timeKeys.length;
      const targetIndex = totalOrders - parseInt(id); // ID начинается с 1, индекс с 0

      if (targetIndex < 0 || targetIndex >= timeKeys.length) {
        return res
          .status(404)
          .json(formatResponse(404, "Заказ не найден", null));
      }

      const targetTimeKey = timeKeys[targetIndex];
      const orderItems = groupedOrders[targetTimeKey];

      // Проверяем, можно ли удалить заказ (только pending заказы)
      if (orderItems[0].status !== "pending") {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Можно удалить только заказы со статусом 'Ожидает подтверждения'",
              null
            )
          );
      }

      // Удаляем все товары из заказа
      await TgOrder.destroy({
        where: {
          id: {
            [require("sequelize").Op.in]: orderItems.map((o) => o.id),
          },
        },
      });

      return res.json(
        formatResponse(200, "Заказ удален успешно", { id: parseInt(id) })
      );
    } catch (error) {
      console.error("Ошибка удаления заказа:", error);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка удаления заказа", null, error.message)
        );
    }
  }
}

module.exports = OrderController;
