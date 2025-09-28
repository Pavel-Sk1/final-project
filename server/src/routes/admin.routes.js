const adminRouter = require("express").Router();
const AdminController = require("../controllers/Admin.controller");
const checkRole = require("../middleware/checkRole");
const verifyAccessToken = require("../middleware/verifyAccessToken");

adminRouter
  .get(
    "/news",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.getAllNews
  )
  .get(
    "/news/:id",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.getNewsById
  )
  .post(
    "/news",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.createNews
  )
  .put(
    "/news/:id",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.updateNews
  )
  .delete(
    "/news/:id",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.deleteNews
  )
  .get(
    "/product",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.getAllProducts
  )
  .get(
    "/product/:id",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.getProductById
  )
  .post(
    "/product",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.createProduct
  )
  .put(
    "/product/:id",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.updateProduct
  )
  .delete(
    "/product/:id",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.deleteProduct
  )
  .get(
    "/order",
    verifyAccessToken,
    checkRole("admin"),
    AdminController.getOrdersByDate
  );

module.exports = adminRouter;
