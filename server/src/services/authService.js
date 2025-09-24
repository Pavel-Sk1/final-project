const { AuthorizedUser } = require("../db/models");

class AuthService {
  /**
   * Проверяет, авторизован ли пользователь
   * @param {string} telegramId - Telegram ID пользователя
   * @returns {Promise<boolean>}
   */
  async isUserAuthorized(telegramId) {
    try {
      const user = await AuthorizedUser.findOne({
        where: {
          tg_user_id: String(telegramId),
          is_active: true,
        },
      });

      return !!user;
    } catch (error) {
      console.error("Ошибка проверки авторизации:", error);
      return false;
    }
  }

  /**
   * Получает информацию об авторизованном пользователе
   * @param {string} telegramId - Telegram ID пользователя
   * @returns {Promise<Object|null>}
   */
  async getUserInfo(telegramId) {
    try {
      const user = await AuthorizedUser.findOne({
        where: {
          tg_user_id: String(telegramId),
          is_active: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Ошибка получения информации о пользователе:", error);
      return null;
    }
  }

  /**
   * Добавляет нового авторизованного пользователя
   * @param {Object} userData - Данные пользователя
   * @param {string} addedBy - Кто добавил пользователя
   * @returns {Promise<Object>}
   */
  async addAuthorizedUser(userData, addedBy) {
    try {
      const user = await AuthorizedUser.create({
        tg_user_id: String(userData.id),
        tg_username: userData.username || null,
        first_name: userData.first_name || null,
        last_name: userData.last_name || null,
        role: userData.role || "user",
        is_active: true,
        added_by: addedBy,
      });

      return user;
    } catch (error) {
      console.error("Ошибка добавления пользователя:", error);
      throw error;
    }
  }

  /**
   * Удаляет авторизованного пользователя
   * @param {string} telegramId - Telegram ID пользователя
   * @returns {Promise<boolean>}
   */
  async removeAuthorizedUser(telegramId) {
    try {
      const result = await AuthorizedUser.update(
        { is_active: false },
        {
          where: {
            tg_user_id: String(telegramId),
          },
        }
      );

      return result[0] > 0;
    } catch (error) {
      console.error("Ошибка удаления пользователя:", error);
      return false;
    }
  }

  /**
   * Получает список всех авторизованных пользователей
   * @returns {Promise<Array>}
   */
  async getAllAuthorizedUsers() {
    try {
      const users = await AuthorizedUser.findAll({
        where: { is_active: true },
        order: [["createdAt", "DESC"]],
      });

      return users;
    } catch (error) {
      console.error("Ошибка получения списка пользователей:", error);
      return [];
    }
  }

  /**
   * Проверяет, является ли пользователь администратором
   * @param {string} telegramId - Telegram ID пользователя
   * @returns {Promise<boolean>}
   */
  async isAdmin(telegramId) {
    try {
      const user = await AuthorizedUser.findOne({
        where: {
          tg_user_id: String(telegramId),
          is_active: true,
          role: "admin",
        },
      });

      return !!user;
    } catch (error) {
      console.error("Ошибка проверки прав администратора:", error);
      return false;
    }
  }
}

module.exports = new AuthService();
