const AuthService = require("../../services/authService");

class AuthMiddleware {
  /**
   * Middleware для проверки авторизации пользователей
   */
  static async checkAuthorization(ctx, next) {
    const userId = ctx.from.id;

    // Проверяем авторизацию для ВСЕХ команд включая /start
    const isAuthorized = await AuthService.isUserAuthorized(userId);

    if (!isAuthorized) {
      await ctx.reply(
        `🚫 *Доступ запрещен*\n\n` +
          `У вас нет прав для использования этого бота.\n` +
          `Обратитесь к администратору для получения доступа.\n\n` +
          `*Ваш Telegram ID: ${userId}*`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    await next();
  }

  /**
   * Middleware для проверки прав администратора
   */
  static async checkAdminRights(ctx, next) {
    const userId = ctx.from.id;

    const isAdmin = await AuthService.isAdmin(userId);
    if (!isAdmin) {
      await ctx.reply("🚫 У вас нет прав для выполнения этой команды");
      return;
    }

    await next();
  }
}

module.exports = AuthMiddleware;
