const { TgOrder, Product, TgUser } = require("../db/models");

class NotificationService {
  // Получение экземпляра бота для уведомлений
  static getBot() {
    try {
      // Пытаемся получить бота из глобального контекста
      if (global.telegramBot) {
        return global.telegramBot;
      }

      // Fallback: пытаемся импортировать из telegram.bot.js
      const bot = require("../../telegram.bot");
      return bot;
    } catch (error) {
      console.error("Error getting bot instance:", error);
      return null;
    }
  }
  /**
   * Отправка уведомления админу о новом заказе
   */
  static async notifyAdminNewOrder(bot, orderId, adminTelegramId) {
    try {
      console.log(
        `🔔 ⚠️ OLD FUNCTION - Attempting to notify admin ${adminTelegramId} about order ${orderId}`
      );

      // Получаем информацию о заказе
      const order = await TgOrder.findByPk(orderId, {
        include: [
          { model: Product, as: "product" },
          { model: TgUser, as: "tgUser" },
        ],
      });

      if (!order) {
        console.error("Order not found for notification:", orderId);
        return;
      }

      console.log(
        `📦 Order found: ${order.id}, Product: ${order.product?.name}, User: ${order.tgUser?.first_name}`
      );

      // Функция для экранирования специальных символов Markdown
      const escapeMarkdown = (text) => {
        if (!text) return text;
        // Для обычного Markdown экранируем только основные символы
        return String(text).replace(/[_*`]/g, "\\$&");
      };

      // Формируем сообщение для админа
      const orderMessage = `
🆕 *Новый заказ поставщику\\!*

📋 *Детали заказа:*
🆔 ID заказа: ${escapeMarkdown(order.id)}
👤 Покупатель: ${escapeMarkdown(
        order.tgUser.first_name || "Не указано"
      )} ${escapeMarkdown(order.tgUser.last_name || "")}
📞 Телефон: ${escapeMarkdown(order.tgUser.phone || "Не указан")}
📛 Username: ${
        order.tgUser.tg_username
          ? `@${escapeMarkdown(order.tgUser.tg_username)}`
          : "Не указан"
      }

🛒 *Товар:*
• ${escapeMarkdown(order.product.name)}
• Количество: ${escapeMarkdown(order.quantity)} шт.
• Цена за единицу: ${escapeMarkdown(order.product.price)}₽
• Общая стоимость: ${escapeMarkdown(order.product.price * order.quantity)}₽

📅 Дата заказа: ${escapeMarkdown(order.createdAt.toLocaleString("ru-RU"))}
📝 Комментарий: ${escapeMarkdown(order.user_comment || "Нет комментария")}

💰 *Итого к оплате: ${escapeMarkdown(order.product.price * order.quantity)}₽*
      `;

      // Создаем клавиатуру с кнопками подтверждения
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "✅ Подтвердить",
              callback_data: `admin_confirm_${order.id}`,
            },
            { text: "❌ Отклонить", callback_data: `admin_reject_${order.id}` },
          ],
          [
            {
              text: "📞 Связаться с покупателем",
              callback_data: `admin_contact_${order.id}`,
            },
          ],
        ],
      };

      // Отправляем сообщение админу
      await bot.telegram.sendMessage(adminTelegramId, orderMessage, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });

      console.log(
        `Notification sent to admin ${adminTelegramId} for order ${orderId}`
      );
    } catch (error) {
      console.error("Error sending admin notification:", error);
    }
  }

  /**
   * Отправка сводного уведомления админу о новых заказах (группированных)
   */
  static async notifyAdminBulkOrder(
    bot,
    orderIds,
    adminTelegramId,
    webOrderInfo = null
  ) {
    try {
      console.log(
        `🔔 🆕 NEW BULK FUNCTION - Attempting to notify admin ${adminTelegramId} about bulk orders:`,
        orderIds
      );

      // Получаем информацию о всех заказах
      const orders = await TgOrder.findAll({
        where: { id: orderIds },
        include: [
          { model: Product, as: "product" },
          { model: TgUser, as: "tgUser" },
        ],
      });

      // Если это веб-заказ, создаем виртуального пользователя
      if (webOrderInfo && orders.length > 0) {
        orders.forEach((order) => {
          if (!order.tgUser) {
            order.tgUser = {
              first_name: webOrderInfo.user_name || "Веб-пользователь",
              last_name: "",
              phone: webOrderInfo.user_phone || "Не указан",
              tg_username: null,
            };
          }
        });
      }

      if (!orders || orders.length === 0) {
        console.error("No orders found for bulk notification:", orderIds);
        return;
      }

      // Группируем заказы по пользователю
      const userOrders = orders.reduce((acc, order) => {
        const userId = order.tg_user_id;
        if (!acc[userId]) {
          acc[userId] = {
            user: order.tgUser,
            orders: [],
            totalAmount: 0,
          };
        }
        acc[userId].orders.push(order);
        acc[userId].totalAmount += order.product.price * order.quantity;
        return acc;
      }, {});

      // Функция для экранирования специальных символов Markdown
      const escapeMarkdown = (text) => {
        if (!text) return text;
        // Для обычного Markdown экранируем только основные символы
        return String(text).replace(/[_*`]/g, "\\$&");
      };

      console.log(
        `📊 Grouped orders by users:`,
        Object.keys(userOrders).map((userId) => ({
          userId,
          orderCount: userOrders[userId].orders.length,
          orderIds: userOrders[userId].orders.map((o) => o.id),
        }))
      );

      // Формируем сообщение для каждого пользователя
      for (const [userId, userOrderData] of Object.entries(userOrders)) {
        const { user, orders: userOrdersList, totalAmount } = userOrderData;

        console.log(
          `📤 Sending SINGLE bulk message to admin for user ${userId} with ${userOrdersList.length} orders`
        );

        // Группируем товары по названию для компактности
        const groupedProducts = {};
        userOrdersList.forEach((order) => {
          const key = `${order.product.name}${
            order.variant
              ? ` (${order.variant === "ж" ? "жареный" : "печеный"})`
              : ""
          }`;
          if (!groupedProducts[key]) {
            groupedProducts[key] = {
              name: order.product.name,
              variant: order.variant,
              price: order.product.price,
              totalQuantity: 0,
              totalCost: 0,
              orderIds: [],
              comments: [],
            };
          }
          groupedProducts[key].totalQuantity += order.quantity;
          groupedProducts[key].totalCost +=
            order.product.price * order.quantity;
          groupedProducts[key].orderIds.push(order.id);
          if (order.user_comment) {
            groupedProducts[key].comments.push(order.user_comment);
          }
        });

        let orderMessage = `🆕 *Новый заказ поставщику*\n\n`;
        orderMessage += `👤 Покупатель: ${escapeMarkdown(
          user.first_name || "Не указано"
        )} ${escapeMarkdown(user.last_name || "")}\n`;
        orderMessage += `📞 Телефон: ${escapeMarkdown(
          user.phone || "Не указан"
        )}\n`;
        orderMessage += `📛 Username: ${
          user.tg_username
            ? `@${escapeMarkdown(user.tg_username)}`
            : "Не указан"
        }\n\n`;

        orderMessage += `🛒 *Товары (${
          Object.keys(groupedProducts).length
        } видов):*\n`;

        Object.values(groupedProducts).forEach((product, index) => {
          orderMessage += `${index + 1}. ${escapeMarkdown(product.name)}`;
          if (product.variant) {
            orderMessage += ` (${
              product.variant === "ж" ? "жареный" : "печеный"
            })`;
          }
          orderMessage += `\n   • Количество: ${product.totalQuantity} шт.\n`;
          orderMessage += `   • Цена: ${product.price}₽ × ${product.totalQuantity} = ${product.totalCost}₽\n`;
          if (product.comments.length > 0) {
            orderMessage += `   • Комментарий: ${escapeMarkdown(
              product.comments[0]
            )}\n`;
          }
          orderMessage += `\n`;
        });

        // Создаем клавиатуру с кнопками для всех заказов
        // Используем только первый и последний ID заказа для экономии места
        const firstOrderId = userOrdersList[0].id;
        const lastOrderId = userOrdersList[userOrdersList.length - 1].id;
        const orderRange =
          userOrdersList.length > 1
            ? `${firstOrderId}-${lastOrderId}`
            : firstOrderId;

        orderMessage += `📅 Дата: ${userOrdersList[0].createdAt.toLocaleString(
          "ru-RU"
        )}\n`;
        orderMessage += `💰 *Итого: ${totalAmount}₽*\n`;
        orderMessage += `📦 Заказов: ${userOrdersList.length} шт. (ID: ${firstOrderId}-${lastOrderId})\n`;

        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "✅ Подтвердить все",
                callback_data: `admin_confirm_bulk_${orderRange}`,
              },
              {
                text: "❌ Отклонить все",
                callback_data: `admin_reject_bulk_${orderRange}`,
              },
            ],
            [
              {
                text: "📞 Связаться с покупателем",
                callback_data: `admin_contact_${firstOrderId}`,
              },
            ],
          ],
        };

        // Получаем бота если не передан
        const botInstance = bot || this.getBot();
        if (!botInstance || !botInstance.telegram) {
          console.error("Bot instance not available for sending notification");
          return;
        }

        // Проверяем длину сообщения (Telegram лимит ~4096 символов)
        const maxMessageLength = 3500; // Оставляем запас для кнопок

        // Отправляем сообщение админу с обработкой ошибок
        try {
          if (orderMessage.length > maxMessageLength) {
            // Если сообщение слишком длинное, отправляем краткую версию
            const shortMessage =
              `🆕 *Новый заказ поставщику*\n\n` +
              `👤 Покупатель: ${escapeMarkdown(
                user.first_name || "Не указано"
              )} ${escapeMarkdown(user.last_name || "")}\n` +
              `📞 Телефон: ${escapeMarkdown(user.phone || "Не указан")}\n` +
              `🛒 Товаров: ${Object.keys(groupedProducts).length} видов\n` +
              `📦 Заказов: ${userOrdersList.length} шт.\n` +
              `💰 Итого: ${totalAmount}₽\n` +
              `📅 Дата: ${userOrdersList[0].createdAt.toLocaleString(
                "ru-RU"
              )}\n` +
              `📦 ID заказов: ${firstOrderId}-${lastOrderId}\n\n` +
              `*Детали заказа будут отправлены отдельным сообщением*`;

            await botInstance.telegram.sendMessage(
              adminTelegramId,
              shortMessage,
              {
                parse_mode: "Markdown",
                reply_markup: keyboard,
              }
            );

            // Отправляем детали отдельным сообщением
            const detailsMessage =
              `📋 *Детали заказа ${firstOrderId}-${lastOrderId}:*\n\n` +
              Object.values(groupedProducts)
                .map(
                  (product, index) =>
                    `${index + 1}. ${escapeMarkdown(product.name)}${
                      product.variant
                        ? ` (${
                            product.variant === "ж" ? "жареный" : "печеный"
                          })`
                        : ""
                    }\n` +
                    `   • ${product.totalQuantity} шт. × ${product.price}₽ = ${product.totalCost}₽`
                )
                .join("\n\n");

            await botInstance.telegram.sendMessage(
              adminTelegramId,
              detailsMessage,
              {
                parse_mode: "Markdown",
              }
            );
          } else {
            // Обычное сообщение
            await botInstance.telegram.sendMessage(
              adminTelegramId,
              orderMessage,
              {
                parse_mode: "Markdown",
                reply_markup: keyboard,
              }
            );
          }
        } catch (sendError) {
          console.error(
            `❌ Failed to send message to admin ${adminTelegramId}:`,
            sendError.message
          );
          // Не прерываем выполнение, просто логируем ошибку
          return;
        }

        console.log(
          `✅ SINGLE bulk notification sent to admin ${adminTelegramId} for user ${userId} orders:`,
          userOrdersList.map((o) => o.id)
        );
      }
    } catch (error) {
      console.error("Error sending admin bulk notification:", error);
    }
  }

  /**
   * Отправка сводного уведомления пользователю о статусе нескольких заказов
   */
  static async notifyUserBulkOrderStatus(
    bot,
    orderIds,
    newStatus,
    userTelegramId
  ) {
    try {
      if (
        !userTelegramId ||
        typeof userTelegramId === "number" ||
        userTelegramId.length < 8
      ) {
        console.log(
          `⚠️ Skipping Telegram notification for user ${userTelegramId} (not a valid Telegram user)`
        );
        return;
      }

      console.log(
        `📤 Sending bulk status notification to user ${userTelegramId} for orders:`,
        orderIds,
        `status: ${newStatus}`
      );

      // Получаем информацию о всех заказах
      const orders = await TgOrder.findAll({
        where: { id: orderIds },
        include: [{ model: Product, as: "product" }],
      });

      if (!orders || orders.length === 0) {
        console.error("No orders found for bulk user notification:", orderIds);
        return;
      }

      const statusMessages = {
        confirmed: "✅ Ваши заказы подтверждены поставщиком!",
        rejected: "❌ Ваши заказы отклонены поставщиком.",
        in_progress: "📦 Ваши заказы готовятся!",
        completed: "🎉 Ваши заказы готовы к выдаче!",
        delivered: "🚚 Ваши заказы доставлены!",
      };

      const statusMessage =
        statusMessages[newStatus] || "📋 Статус ваших заказов изменен.";

      let message = `${statusMessage}\n\n`;
      message += `📋 *Детали заказов (${orders.length} позиций):*\n`;

      let totalAmount = 0;
      orders.forEach((order, index) => {
        const orderAmount = order.product.price * order.quantity;
        totalAmount += orderAmount;

        message += `${index + 1}. 🛒 ${order.product.name}\n`;
        message += `   📦 Количество: ${order.quantity} шт.\n`;
        message += `   💰 Стоимость: ${orderAmount}₽\n`;
        message += `   🆔 ID заказа: ${order.id}\n\n`;
      });

      message += `💰 *Общая стоимость: ${totalAmount}₽*\n`;
      message += `📅 Дата: ${orders[0].createdAt.toLocaleString("ru-RU")}`;

      await bot.telegram.sendMessage(userTelegramId, message, {
        parse_mode: "Markdown",
      });

      console.log(
        `Bulk status notification sent to user ${userTelegramId} for orders:`,
        orderIds
      );
    } catch (error) {
      console.error("Error sending bulk user notification:", error);
    }
  }

  /**
   * Отправка уведомления пользователю об изменении статуса заказа
   */
  static async notifyUserOrderStatus(bot, orderId, newStatus, userTelegramId) {
    try {
      console.log(
        `📤 Sending status notification to user ${userTelegramId} for order ${orderId}, status: ${newStatus}`
      );

      const order = await TgOrder.findByPk(orderId, {
        include: [{ model: Product, as: "product" }],
      });

      if (!order) {
        console.error("Order not found for user notification:", orderId);
        return;
      }

      console.log(
        `📦 Order found for user notification: ${order.id}, product: ${order.product?.name}`
      );

      const statusMessages = {
        confirmed: "✅ Ваш заказ подтвержден поставщиком!",
        rejected: "❌ Ваш заказ отклонен поставщиком.",
        in_progress: "📦 Ваш заказ готовится!",
        completed: "🎉 Ваш заказ готов к выдаче!",
        delivered: "🚚 Ваш заказ доставлен!",
      };

      const statusMessage =
        statusMessages[newStatus] || "📋 Статус вашего заказа изменен.";

      const message = `
${statusMessage}

📋 *Детали заказа:*
🆔 ID: ${order.id}
🛒 Товар: ${order.product.name}
📦 Количество: ${order.quantity} шт.
💰 Стоимость: ${order.product.price * order.quantity}₽
📅 Дата: ${order.createdAt.toLocaleString("ru-RU")}
      `;

      await bot.telegram.sendMessage(userTelegramId, message, {
        parse_mode: "Markdown",
      });

      console.log(
        `Status notification sent to user ${userTelegramId} for order ${orderId}`
      );
    } catch (error) {
      console.error("Error sending user notification:", error);
    }
  }

  /**
   * Получение списка всех админов
   */
  static async getAdminTelegramIds() {
    try {
      const { AuthorizedUser } = require("../db/models");
      const admins = await AuthorizedUser.findAll({
        where: {
          role: "admin",
          is_active: true,
        },
      });

      const adminIds = admins.map((admin) => admin.tg_user_id);
      console.log(`👥 Found ${adminIds.length} active admins:`, adminIds);
      return adminIds;
    } catch (error) {
      console.error("Error getting admin IDs:", error);
      return [];
    }
  }
}

module.exports = NotificationService;
