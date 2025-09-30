const { TgOrder, TgUser, Product, Category } = require("../db/models");
const { sequelize, Op } = require("../db/models");

class OrderService {
  // Безопасное создание или поиск пользователя
  static async findOrCreateUser(telegramId, userInfo, transaction) {
    const telegramIdStr = String(telegramId);

    try {
      // Получаем название магазина из authorized_users
      const { AuthorizedUser } = require("../db/models");
      const authorizedUser = await AuthorizedUser.findOne({
        where: { tg_user_id: telegramIdStr, is_active: true },
        transaction,
      });

      const shopName =
        authorizedUser?.shop_name || userInfo?.first_name || null;

      console.log(`🏪 Shop name for user ${telegramIdStr}: ${shopName}`);

      // Используем findOrCreate для атомарной операции
      const [tgUser, created] = await TgUser.findOrCreate({
        where: { tg_user_id: telegramIdStr },
        defaults: {
          tg_user_id: telegramIdStr,
          tg_username: userInfo?.username || null,
          first_name: shopName, // Используем название магазина как first_name
          last_name: userInfo?.last_name || null,
        },
        transaction,
      });

      // Если пользователь существовал и нужно обновить данные
      if (!created && userInfo) {
        await tgUser.update(
          {
            tg_username: userInfo.username || tgUser.tg_username,
            first_name: shopName || tgUser.first_name, // Обновляем название магазина
            last_name: userInfo.last_name || tgUser.last_name,
          },
          { transaction }
        );
      }

      console.log(
        `${
          created ? "✅ Created new user" : "👤 Found existing user"
        }: ${telegramIdStr}`
      );
      return tgUser;
    } catch (error) {
      console.error("Error in findOrCreateUser:", {
        telegramId: telegramIdStr,
        error: error.message,
        stack: error.stack,
      });

      // Если ошибка связана с уникальностью, попробуем просто найти пользователя
      if (error.name === "SequelizeUniqueConstraintError") {
        console.log("🔄 Attempting to find user after unique constraint error");
        const existingUser = await TgUser.findOne({
          where: { tg_user_id: telegramIdStr },
          transaction,
        });

        if (existingUser) {
          console.log("✅ Found existing user after constraint error");
          return existingUser;
        }
      }

      throw error;
    }
  }

  // Парсинг текста с вариантами (например: "пирож ж/п - 10/15")
  static parseVariantOrder(text) {
    const regex = /^(.+?)\s+([а-яё/]+)\s*-\s*(\d+(?:\/\d+)*)$/i;
    const match = text.match(regex);

    if (!match) {
      return null;
    }

    const [, productName, variants, quantities] = match;
    const variantList = variants.split("/");
    const quantityList = quantities.split("/").map((q) => parseInt(q.trim()));

    if (variantList.length !== quantityList.length) {
      return null;
    }

    const variantQuantities = {};
    for (let i = 0; i < variantList.length; i++) {
      variantQuantities[variantList[i].trim()] = quantityList[i];
    }

    return {
      productName: productName.trim(),
      variantQuantities: variantQuantities,
    };
  }
  // Создание заказа с вариантами
  static async createOrderWithVariants(
    telegramId,
    productId,
    variantQuantities,
    userComment = null,
    userInfo = {}
  ) {
    const transaction = await sequelize.transaction();

    try {
      console.log(
        `🚀 Starting createOrderWithVariants for telegramId: ${telegramId}, productId: ${productId}`
      );

      // Находим или создаем пользователя
      const tgUser = await this.findOrCreateUser(
        telegramId,
        userInfo,
        transaction
      );

      console.log(`👤 User resolved for variants: ${tgUser.tg_user_id}`);

      // Проверяем продукт
      const product = await Product.findOne({
        where: {
          id: productId,
          is_active: true,
        },
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
        transaction,
      });

      if (!product) {
        throw new Error("Продукт не найден или неактивен");
      }

      const results = [];
      let totalPrice = 0;
      let totalQuantity = 0;

      // Создаем заказы для каждого варианта
      for (const [variant, quantity] of Object.entries(variantQuantities)) {
        if (quantity > 0) {
          const order = await TgOrder.create(
            {
              tg_user_id: tgUser.tg_user_id,
              product_id: productId,
              quantity: quantity,
              variant: variant, // Добавляем сохранение варианта
              user_comment: userComment,
              status: "pending",
            },
            { transaction }
          );

          const variantPrice = product.price * quantity;
          totalPrice += variantPrice;
          totalQuantity += quantity;

          results.push({
            success: true,
            product: product,
            variant: variant,
            quantity: quantity,
            totalPrice: variantPrice,
            orderId: order.id,
          });
        }
      }

      await transaction.commit();

      return {
        success: true,
        results: results,
        totalPrice: totalPrice,
        quantity: totalQuantity,
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Detailed error in createOrderWithVariants:", {
        error: error.message,
        name: error.name,
        errors: error.errors,
        parent: error.parent?.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // Создание заказа (оригинальный метод)
  static async createOrder(
    telegramId,
    productId,
    quantity,
    userComment = null,
    userInfo = {}
  ) {
    const transaction = await sequelize.transaction();

    try {
      console.log(
        `🚀 Starting createOrder for telegramId: ${telegramId}, productId: ${productId}`
      );

      // Находим или создаем пользователя
      const tgUser = await this.findOrCreateUser(
        telegramId,
        userInfo,
        transaction
      );

      console.log(`👤 User resolved: ${tgUser.tg_user_id}`);

      // Проверяем продукт
      const product = await Product.findOne({
        where: {
          id: productId,
          is_active: true,
        },
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
        transaction,
      });

      if (!product) {
        throw new Error("Продукт не найден или недоступен");
      }

      // Рассчитываем итоговую цену
      const totalPrice = product.price * quantity;

      // Создаем заказ
      const order = await TgOrder.create(
        {
          tg_user_id: tgUser.tg_user_id,
          product_id: productId,
          quantity: quantity,
          user_comment: userComment,
          status: "pending",
        },
        { transaction }
      );

      await transaction.commit();

      console.log(
        `✅ Order created successfully: ID=${order.id}, Product=${product.name}, Quantity=${quantity}`
      );

      return {
        success: true,
        order,
        product,
        quantity,
        totalPrice,
        tgUser,
        orderId: order.id,
      };
    } catch (error) {
      await transaction.rollback();
      console.error("Detailed error in createOrder:", {
        error: error.message,
        name: error.name,
        errors: error.errors,
        parent: error.parent?.message,
        stack: error.stack,
      });
      throw new Error(`Ошибка создания заказа: ${error.message}`);
    }
  }

  // Получение заказов пользователя
  static async getUserOrders(telegramId) {
    try {
      const telegramIdStr = String(telegramId);
      const tgUser = await TgUser.findOne({
        where: { tg_user_id: telegramIdStr },
      });

      if (!tgUser) return [];

      const orders = await TgOrder.findAll({
        where: { tg_user_id: tgUser.tg_user_id },
        include: [
          {
            model: Product,
            as: "product",
            include: [
              {
                model: Category,
                as: "category",
              },
            ],
          },
          {
            model: TgUser,
            as: "tgUser",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return orders;
    } catch (error) {
      throw new Error(`Ошибка получения заказов: ${error.message}`);
    }
  }

  // Получение категорий с товарами
  static async getCategoriesWithProducts() {
    try {
      return await Category.findAll({
        include: [
          {
            model: Product,
            as: "products",
            where: { is_active: true },
            required: false,
          },
        ],
        order: [["name", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Ошибка получения категорий: ${error.message}`);
    }
  }

  // Получение всех активных товаров
  static async getActiveProducts() {
    try {
      return await Product.findAll({
        where: { is_active: true },
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
        order: [["name", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Ошибка получения товаров: ${error.message}`);
    }
  }

  // Поиск товаров по названию
  static async searchProducts(query) {
    try {
      return await Product.findAll({
        where: {
          name: { [Op.iLike]: `%${query}%` },
          is_active: true,
        },
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
        limit: 10,
      });
    } catch (error) {
      throw new Error(`Ошибка поиска товаров: ${error.message}`);
    }
  }

  // Создание множественных заказов из текста
  static async createOrdersFromText(telegramId, orderText, userInfo = {}) {
    console.log("Creating orders from text:", {
      telegramId,
      orderText,
      userInfo,
    });
    const transaction = await sequelize.transaction();

    try {
      const orderItems = this.parseOrderText(orderText);
      console.log("Parsed order items:", orderItems);
      const results = [];

      for (const item of orderItems) {
        const { productName, quantity, comment } = item;
        console.log("Processing item:", { productName, quantity, comment });

        // Ищем продукт по названию
        const product = await Product.findOne({
          where: {
            name: { [Op.iLike]: `%${productName}%` },
            is_active: true,
          },
          include: [
            {
              model: Category,
              as: "category",
            },
          ],
          transaction,
        });

        console.log("Found product:", product ? product.name : "Not found");

        if (!product) {
          results.push({
            success: false,
            productName,
            error: `Продукт "${productName}" не найден`,
          });
          continue;
        }

        // Создаем заказ
        const orderResult = await this.createOrder(
          telegramId,
          product.id,
          quantity,
          comment,
          userInfo
        );

        results.push({
          success: true,
          product: product,
          quantity: quantity,
          totalPrice: product.price * quantity,
          order: orderResult.order,
        });
      }

      await transaction.commit();
      console.log("Orders created successfully:", results);
      return results;
    } catch (error) {
      await transaction.rollback();
      console.error("Error in createOrdersFromText:", error);
      throw new Error(`Ошибка создания заказов: ${error.message}`);
    }
  }

  // Парсинг текста заказа
  static parseOrderText(text) {
    const lines = text.split("\n").filter((line) => line.trim());
    const items = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Паттерн: "название продукта - количество" или "название продукта - количество комментарий"
      const match = trimmedLine.match(/^(.+?)\s*-\s*(\d+(?:\.\d+)?)\s*(.*)$/);

      if (match) {
        const [, productName, quantityStr, comment] = match;
        const quantity = parseFloat(quantityStr);

        if (!isNaN(quantity) && quantity > 0) {
          items.push({
            productName: productName.trim(),
            quantity: Math.floor(quantity), // Округляем до целого числа
            comment: comment.trim() || null,
          });
        }
      }
    }

    return items;
  }

  // Получение статистики заказов пользователя
  static async getUserOrderStats(telegramId) {
    try {
      const telegramIdStr = String(telegramId);
      const tgUser = await TgUser.findOne({
        where: { tg_user_id: telegramIdStr },
      });

      if (!tgUser) return null;

      const orders = await TgOrder.findAll({
        where: { tg_user_id: tgUser.tg_user_id },
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      });

      const totalOrders = orders.length;
      const totalAmount = orders.reduce((sum, order) => {
        return sum + order.product.price * order.quantity;
      }, 0);

      const averageOrder =
        totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0;

      return {
        totalOrders,
        totalAmount,
        averageOrder,
        lastOrder: orders.length > 0 ? orders[0] : null,
      };
    } catch (error) {
      throw new Error(`Ошибка получения статистики: ${error.message}`);
    }
  }
}

module.exports = OrderService;
