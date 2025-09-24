const AuthService = require("../../services/authService");

class AdminHandlers {
  constructor(botController) {
    this.botController = botController;
  }

  /**
   * Обработчик команды /adduser
   */
  async handleAddUser(ctx) {
    const messageText = ctx.message.text;
    const parts = messageText.split(" ");

    if (parts.length < 2) {
      await ctx.reply(
        "📝 *Использование:* `/adduser <telegram_id> [role]`\n\n" +
          "Примеры:\n" +
          "`/adduser 123456789` - добавить обычного пользователя\n" +
          "`/adduser 123456789 admin` - добавить администратора",
        { parse_mode: "Markdown" }
      );
      return;
    }

    const targetUserId = parts[1];
    const role = parts[2] || "user";

    try {
      // Создаем объект пользователя для добавления
      const userData = {
        id: targetUserId,
        username: null,
        first_name: null,
        last_name: null,
        role: role,
      };

      await AuthService.addAuthorizedUser(userData, String(ctx.from.id));

      await ctx.reply(
        `✅ *Пользователь добавлен!*\n\n` +
          `🆔 ID: ${targetUserId}\n` +
          `👤 Роль: ${role}\n` +
          `➕ Добавил: ${ctx.from.username || ctx.from.first_name}`,
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      console.error("Ошибка добавления пользователя:", error);
      await ctx.reply("❌ Ошибка при добавлении пользователя");
    }
  }

  /**
   * Обработчик команды /removeuser
   */
  async handleRemoveUser(ctx) {
    const messageText = ctx.message.text;
    const parts = messageText.split(" ");

    if (parts.length < 2) {
      await ctx.reply(
        "📝 *Использование:* `/removeuser <telegram_id>`\n\n" +
          "Пример: `/removeuser 123456789`",
        { parse_mode: "Markdown" }
      );
      return;
    }

    const targetUserId = parts[1];

    try {
      const success = await AuthService.removeAuthorizedUser(targetUserId);

      if (success) {
        await ctx.reply(
          `✅ *Пользователь удален!*\n\n` +
            `🆔 ID: ${targetUserId}\n` +
            `➖ Удалил: ${ctx.from.username || ctx.from.first_name}`,
          { parse_mode: "Markdown" }
        );
      } else {
        await ctx.reply("❌ Пользователь не найден или уже удален");
      }
    } catch (error) {
      console.error("Ошибка удаления пользователя:", error);
      await ctx.reply("❌ Ошибка при удалении пользователя");
    }
  }

  /**
   * Обработчик команды /listusers
   */
  async handleListUsers(ctx) {
    try {
      const users = await AuthService.getAllAuthorizedUsers();

      if (users.length === 0) {
        await ctx.reply("📋 Список авторизованных пользователей пуст");
        return;
      }

      let usersText = "📋 *Список авторизованных пользователей:*\n\n";

      for (const user of users) {
        usersText += `🆔 ID: ${user.tg_user_id}\n`;
        usersText += `👤 Имя: ${user.first_name || "Не указано"}\n`;
        usersText += `📛 Username: @${user.tg_username || "Не указан"}\n`;
        usersText += `🔑 Роль: ${user.role}\n`;
        usersText += `📅 Добавлен: ${user.createdAt.toLocaleDateString()}\n`;
        usersText += `➕ Добавил: ${user.added_by || "Система"}\n\n`;
      }

      await ctx.reply(usersText, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("Ошибка получения списка пользователей:", error);
      await ctx.reply("❌ Ошибка при получении списка пользователей");
    }
  }
}

module.exports = AdminHandlers;
