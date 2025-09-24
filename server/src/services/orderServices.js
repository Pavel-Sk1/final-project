const { TgOrder, TgUser, Product, Category } = require("../db/models");
const { sequelize, Op } = require("../db/models");

class OrderService {
  // Создание заказа
  static async createOrder(
    telegramId,
    productId,
    quantity,
    userComment = null,
    userInfo = {}
  ) {
    const transaction = await sequelize.transaction();

    try {
      // Находим или создаем пользователя
      const [tgUser] = await TgUser.findOrCreate({
        where: { tg_user_id: telegramId },
        defaults: {
          tg_user_id: telegramId,
          tg_username: userInfo.username || null,
          first_name: userInfo.first_name || null,
          last_name: userInfo.last_name || null,
        },
        transaction,
      });

      // Проверяем продукт
      const product = await Product.findOne({
        where: {
          id: productId,
          is_active: 1,
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
          tg_user_id: tgUser.id,
          product_id: productId,
          quantity: quantity,
          user_comment: userComment,
          status: "pending",
        },
        { transaction }
      );

      await transaction.commit();

      return {
        order,
        product,
        totalPrice,
        tgUser,
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Ошибка создания заказа: ${error.message}`);
    }
  }

  // Получение заказов пользователя
  static async getUserOrders(telegramId) {
    try {
      const tgUser = await TgUser.findOne({
        where: { tg_user_id: telegramId },
      });

      if (!tgUser) return [];

      const orders = await TgOrder.findAll({
        where: { tg_user_id: tgUser.id },
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
        order: [["created_at", "DESC"]],
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
            where: { is_active: 1 },
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
        where: { is_active: 1 },
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
          is_active: 1,
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
}

module.exports = OrderService;
