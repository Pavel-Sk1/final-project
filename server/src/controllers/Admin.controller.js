const AdminService = require("../services/Admin.service");
const formatResponse = require("../utils/formatResponse");
const isValidId = require("../utils/isValidId");
const {
  News: NewsValidator,
  Product: ProductValidator,
} = require("../db/models");

class AdminController {
  static async getAllNews(req, res) {
    try {
      const information = await AdminService.getAllNews();
      res
        .status(200)
        .json(formatResponse(200, "Новости получены успешно", information));
    } catch (error) {
      console.error("======AdminController.getAllNews===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async getNewsById(req, res) {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res
          .status(400)
          .json(formatResponse(400, "Invalid id", null, "Invalid id"));
      }
      const information = await AdminService.getNewsById(id);
      res
        .status(200)
        .json(formatResponse(200, "Новость получена успешно", information));
    } catch (error) {
      console.error("======AdminController.getNewsById===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async createNews(req, res) {
    try {
      const { title, description, img, is_active } = req.body;
      const { isValid, error } = NewsValidator.validate({
        title,
        description,
        img,
        is_active,
      });
      if (!isValid) {
        return res.status(400).json(formatResponse(400, error, null, error));
      }
      const information = await AdminService.createNews({
        title,
        description,
        img,
        is_active,
      });
      if (!information) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Новость не создана",
              null,
              "Новость не создана"
            )
          );
      }
      res
        .status(200)
        .json(formatResponse(200, "Новость создана успешно", information));
    } catch (error) {
      console.error("======AdminController.createNews===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async updateNews(req, res) {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res
          .status(400)
          .json(formatResponse(400, "Неверный id", null, "Неверный id"));
      }
      const { title, description, img, is_active } = req.body;

      const { isValid, error } = NewsValidator.validate({
        title,
        description,
        img,
        is_active,
      });
      if (!isValid) {
        return res.status(400).json(formatResponse(400, error, null, error));
      }
      const news = await AdminService.updateNews(id, {
        title,
        description,
        img,
        is_active,
      });
      res
        .status(200)
        .json(formatResponse(200, "Новость обновлена успешно", news));
    } catch (error) {
      console.error("======AdminController.updateNews===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async deleteNews(req, res) {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res
          .status(400)
          .json(formatResponse(400, "Неверный id", null, "Неверный id"));
      }
      const information = await AdminService.deleteNews(id);
      res
        .status(200)
        .json(formatResponse(200, "Новость удалена успешно", information));
    } catch (error) {
      console.error("======AdminController.deleteNews===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Internal server error", null, error));
    }
  }
  static async getAllProducts(req, res) {
    try {
      const products = await AdminService.getAllProducts();
      res
        .status(200)
        .json(formatResponse(200, "Продукты получены успешно", products));
    } catch (error) {
      console.error("======AdminController.getAllProducts===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res
          .status(400)
          .json(formatResponse(400, "Неверный id", null, "Неверный id"));
      }
      const product = await AdminService.getProductById(id);
      res
        .status(200)
        .json(formatResponse(200, "Продукт получен успешно", product));
    } catch (error) {
      console.error("======AdminController.getProductById===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res
          .status(400)
          .json(formatResponse(400, "Неверный id", null, "Неверный id"));
      }
      const { img } = req.body;
      const { isValid, error } = ProductValidator.validateImg({ img });
      if (!isValid) {
        return res.status(400).json(formatResponse(400, error, null, error));
      }
      const product = await AdminService.updateProduct(id, { img });
      res
        .status(200)
        .json(formatResponse(200, "Продукт обновлен успешно", product));
    } catch (error) {
      console.error("======AdminController.updateProduct===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async getOrdersByDate(req, res) {
    try {
      const { date, status } = req.query;

      const orders = await AdminService.getOrdersByDate(date, status);

      res
        .status(200)
        .json(formatResponse(200, "Заказы получены успешно", orders));
    } catch (error) {
      console.error("======AdminController.getOrdersByDate===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }
}

module.exports = AdminController;
