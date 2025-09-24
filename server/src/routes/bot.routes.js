const express = require("express");
const router = express.Router();
const OrderService = require("../services/orderServices");
const { TgOrder, TgUser, Product, Category } = require("../db/models");

// Получение всех заказов от магазинов (для поставщика)
router.get("/orders", async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const orders = await TgOrder.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: TgUser,
          as: "tgUser",
          attributes: [
            "id",
            "tg_user_id",
            "tg_username",
            "first_name",
            "last_name",
            "phone",
          ],
        },
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
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        orders: orders.rows,
        total: orders.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка при получении заказов от магазинов",
    });
  }
});

// Получение заказа по ID
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await TgOrder.findByPk(id, {
      include: [
        {
          model: TgUser,
          as: "tgUser",
          attributes: [
            "id",
            "tg_user_id",
            "tg_username",
            "first_name",
            "last_name",
            "phone",
          ],
        },
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
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Заказ не найден",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка при получении заказа",
    });
  }
});

// Обновление статуса заказа (для поставщика)
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "in_progress",
      "completed",
      "cancelled",
      "delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Неверный статус заказа",
      });
    }

    const order = await TgOrder.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Заказ не найден",
      });
    }

    await order.update({ status });

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка при обновлении статуса заказа",
    });
  }
});

// Получение статистики заказов (для поставщика)
router.get("/stats", async (req, res) => {
  try {
    const { period = "day" } = req.query; // day, week, month

    let dateFilter = new Date();
    switch (period) {
      case "week":
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case "month":
        dateFilter.setMonth(dateFilter.getMonth() - 1);
        break;
      default:
        dateFilter.setHours(0, 0, 0, 0);
    }

    const orders = await TgOrder.findAll({
      where: {
        createdAt: {
          [require("sequelize").Op.gte]: dateFilter,
        },
      },
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

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const categoryStats = {};
    orders.forEach((order) => {
      const categoryName = order.product.category?.name || "Без категории";
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = { count: 0, amount: 0 };
      }
      categoryStats[categoryName].count += order.quantity;
      categoryStats[categoryName].amount +=
        order.product.price * order.quantity;
    });

    // Статистика по магазинам
    const storeStats = {};
    orders.forEach((order) => {
      const storeName =
        order.tgUser.first_name ||
        order.tgUser.tg_username ||
        `Магазин #${order.tgUser.tg_user_id}`;
      if (!storeStats[storeName]) {
        storeStats[storeName] = { orders: 0, amount: 0 };
      }
      storeStats[storeName].orders += 1;
      storeStats[storeName].amount += order.product.price * order.quantity;
    });

    res.json({
      success: true,
      data: {
        period,
        totalOrders,
        totalAmount,
        statusCounts,
        categoryStats,
        storeStats,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка при получении статистики",
    });
  }
});

// Получение клиентов (магазинов)
router.get("/stores", async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const users = await TgUser.findAndCountAll({
      attributes: [
        "id",
        "tg_user_id",
        "tg_username",
        "first_name",
        "last_name",
        "phone",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        stores: users.rows,
        total: users.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка при получении списка магазинов",
    });
  }
});

// Получение заказов конкретного магазина
router.get("/stores/:storeId/orders", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const tgUser = await TgUser.findOne({
      where: { tg_user_id: storeId },
    });

    if (!tgUser) {
      return res.status(404).json({
        success: false,
        error: "Магазин не найден",
      });
    }

    whereClause.tg_user_id = tgUser.id;

    const orders = await TgOrder.findAndCountAll({
      where: whereClause,
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
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        store: tgUser,
        orders: orders.rows,
        total: orders.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error fetching store orders:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка при получении заказов магазина",
    });
  }
});

module.exports = router;
