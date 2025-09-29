const AdminService = require("../services/Admin.service");
const formatResponse = require("../utils/formatResponse");
const isValidId = require("../utils/isValidId");
const {
  News: NewsValidator,
  Product: ProductValidator,
  Vacancy: VacancyValidator,
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

  static async createProduct(req, res) {
    try {
      const { name, img, price, recipe, category_id, is_active, variants, variant_names } = req.body;
      const { isValid, error } = ProductValidator.validate({ name, img, price, recipe, category_id, is_active, variants, variant_names });
      if (!isValid) {
        return res.status(400).json(formatResponse(400, error, null, error));
      }
      const product = await AdminService.createProduct({ name, img, price, recipe, category_id, is_active, variants, variant_names });
      res
        .status(200)
        .json(formatResponse(200, "Продукт создан успешно", product));
    } catch (error) {
      console.error("======AdminController.createProduct===\n", error);
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

  static async deleteProduct(req, res) {

    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json(formatResponse(400, "Неверный id", null, "Неверный id"));
      }
      const product = await AdminService.deleteProduct(id);
      res
        .status(200)
        .json(formatResponse(200, "Продукт удален успешно", product));
    } catch (error) {
      console.error("======AdminController.deleteProduct===\n", error);
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
  static async getAllVacancies(req, res) {
    try {
      const vacancies = await AdminService.getAllVacancies();
      res
        .status(200)
        .json(formatResponse(200, "Вакансии получены успешно", vacancies));
    }  catch (error) {
    console.error("======AdminController.getAllVacancies===\n", error);
    res
      .status(500)
      .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
  }
}
  static async getVacancyById(req, res) {
    try {
      const { id } = req.params;
      const vacancy = await AdminService.getVacancyById(id);
      res
        .status(200)
        .json(formatResponse(200, "Вакансия получена успешно", vacancy));
    } catch (error) {
      console.error("======AdminController.getVacancyById===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }
  static async createVacancy(req, res) {
    try {
      const { position, location, salary, description, is_active } = req.body;
      const { isValid, error } = VacancyValidator.validate({ position, location, salary, description, is_active });
      if (!isValid) {
        return res.status(400).json(formatResponse(400, error, null, error));
      }
      const vacancy = await AdminService.createVacancy({ position, location, salary, description, is_active });
      res
        .status(200)
        .json(formatResponse(200, "Вакансия создана успешно", vacancy));
    } catch (error) {
      console.error("======AdminController.createVacancy===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }
  static async updateVacancy(req, res) {
    try {
      const { id } = req.params;
      const { position, location, salary, description, is_active } = req.body;
      const { isValid, error } = VacancyValidator.validate({ position, location, salary, description, is_active });
      if (!isValid) {
        return res.status(400).json(formatResponse(400, error, null, error));
      }
      const vacancy = await AdminService.updateVacancy(id, { position, location, salary, description, is_active });
      res
        .status(200)
        .json(formatResponse(200, "Вакансия обновлена успешно", vacancy));
    } catch (error) {
      console.error("======AdminController.updateVacancy===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }
  static async deleteVacancy(req, res) {
    try {
      const { id } = req.params;
      const vacancy = await AdminService.deleteVacancy(id);
      res
        .status(200)
        .json(formatResponse(200, "Вакансия удалена успешно", vacancy));
    } catch (error) {
      console.error("======AdminController.deleteVacancy===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }
}
module.exports = AdminController
