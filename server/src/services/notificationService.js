const { TgOrder, Product, TgUser } = require("../db/models");

class NotificationService {
  /**
   * Отправка уведомления админу о новом заказе
   */
  static async notifyAdminNewOrder(bot, orderId, adminTelegramId) {
    try {
      console.log(
        `🔔 Attempting to notify admin ${adminTelegramId} about order ${orderId}`
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
        return String(text).replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
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
• Количество: ${escapeMarkdown(order.quantity)} шт\.
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
