const { TgOrder } = require("../../db/models");
const NotificationService = require("../../services/notificationService");

class AdminActionHandlers {
  constructor(botController) {
    this.botController = botController;
  }

  /**
   * Обработчик подтверждения заказа админом
   */
  async handleConfirmOrder(ctx) {
    const orderId = parseInt(ctx.match[1]);
    const adminId = ctx.from.id;

    try {
      console.log(`🔔 Admin ${adminId} confirming order ${orderId}`);

      // Обновляем статус заказа
      const order = await TgOrder.findByPk(orderId);
      if (!order) {
        console.log(`❌ Order ${orderId} not found`);
        await ctx.answerCbQuery("Заказ не найден");
        return;
      }

      console.log(
        `📦 Found order: ${order.id}, current status: ${order.status}`
      );
      await order.update({ status: "confirmed" });
      console.log(`✅ Order ${orderId} status updated to confirmed`);

      // Уведомляем пользователя
      console.log(
        `📤 Notifying user ${order.tg_user_id} about order confirmation`
      );
      await NotificationService.notifyUserOrderStatus(
        this.botController.bot,
        orderId,
        "confirmed",
        order.tg_user_id
      );
      console.log(`✅ User notification sent for order ${orderId}`);

      // Обновляем сообщение админу (без Markdown, чтобы избежать ошибок парсинга)
      const updatedText =
        ctx.callbackQuery.message.text + "\n\n✅ Заказ подтвержден админом";
      await ctx.editMessageText(updatedText);

      await ctx.answerCbQuery("Заказ подтвержден!");
      console.log(`✅ Order ${orderId} confirmed by admin ${adminId}`);
    } catch (error) {
      console.error("Error confirming order:", error);
      await ctx.answerCbQuery("Ошибка при подтверждении заказа");
    }
  }

  /**
   * Обработчик отклонения заказа админом
   */
  async handleRejectOrder(ctx) {
    const orderId = parseInt(ctx.match[1]);
    const adminId = ctx.from.id;

    try {
      console.log(`🔔 Admin ${adminId} rejecting order ${orderId}`);

      // Обновляем статус заказа
      const order = await TgOrder.findByPk(orderId);
      if (!order) {
        console.log(`❌ Order ${orderId} not found`);
        await ctx.answerCbQuery("Заказ не найден");
        return;
      }

      console.log(
        `📦 Found order: ${order.id}, current status: ${order.status}`
      );
      await order.update({ status: "rejected" });
      console.log(`✅ Order ${orderId} status updated to rejected`);

      // Уведомляем пользователя
      console.log(
        `📤 Notifying user ${order.tg_user_id} about order rejection`
      );
      await NotificationService.notifyUserOrderStatus(
        this.botController.bot,
        orderId,
        "rejected",
        order.tg_user_id
      );
      console.log(`✅ User notification sent for order ${orderId}`);

      // Обновляем сообщение админу (без Markdown, чтобы избежать ошибок парсинга)
      const updatedText =
        ctx.callbackQuery.message.text + "\n\n❌ Заказ отклонен админом";
      await ctx.editMessageText(updatedText);

      await ctx.answerCbQuery("Заказ отклонен!");
      console.log(`✅ Order ${orderId} rejected by admin ${adminId}`);
    } catch (error) {
      console.error("Error rejecting order:", error);
      await ctx.answerCbQuery("Ошибка при отклонении заказа");
    }
  }

  /**
   * Обработчик запроса связи с покупателем
   */
  async handleContactCustomer(ctx) {
    const orderId = parseInt(ctx.match[1]);

    try {
      const order = await TgOrder.findByPk(orderId, {
        include: [{ model: require("../../db/models").TgUser, as: "tgUser" }],
      });
      if (!order) {
        await ctx.answerCbQuery("Заказ не найден");
        return;
      }

      const contactMessage = `
📞 *Контактная информация покупателя:*

🆔 Telegram ID: ${order.tg_user_id}
👤 Имя: ${order.tgUser?.first_name || "Не указано"}
📛 Username: @${order.tgUser?.tg_username || "Не указан"}
📞 Телефон: ${order.tgUser?.phone || "Не указан"}

💬 Для связи используйте: tg://user?id=${order.tg_user_id}
      `;

      await ctx.reply(contactMessage, { parse_mode: "Markdown" });
      await ctx.answerCbQuery("Контактная информация отправлена");
    } catch (error) {
      console.error("Error getting contact info:", error);
      await ctx.answerCbQuery("Ошибка при получении контактов");
    }
  }
}

module.exports = AdminActionHandlers;
