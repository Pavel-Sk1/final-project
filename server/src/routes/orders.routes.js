const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller");
const verifyAccessToken = require("../middleware/verifyAccessToken");

// Все роуты требуют авторизации
router.use(verifyAccessToken);

// Создание заказа
router.post("/", OrderController.createOrder);

// Получение заказов пользователя
router.get("/user", OrderController.getUserOrders);

// Получение заказа по ID
router.get("/:id", OrderController.getOrderById);

// Удаление заказа
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
