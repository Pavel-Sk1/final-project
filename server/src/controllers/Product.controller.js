const formatResponse = require("../utils/formatResponse");
const ProductService = require("../services/Product.service");

class ProductController {
  static async getList(req, res) {
    try {
      const products = await ProductService.getActiveOrdered(40);
      return res.json(formatResponse(200, "OK", products));
    } catch ({ message }) {
      return res
        .status(500)
        .json(formatResponse(500, "Ошибка получения продуктов", null, message));
    }
  }
  static async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      if (!products) {
        return res
          .status(404)
          .json(formatResponse(404, "Продукты не найдены", null));
      }
      return res.json(
        formatResponse(200, "Продукты получены успешно", products)
      );
    } catch ({ message }) {
      console.error("======ProductController.getAllProducts===\n", message);
      return res
        .status(500)
        .json(formatResponse(500, "Ошибка получения продуктов", null, message));
    }
  }
  static async createProduct(req, res) {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      if (!newProduct) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Ошибка создания продукта",
              null,
              "Ошибка создания продукта"
            )
          );
      }
      return res.json(
        formatResponse(200, "Продукт создан успешно", newProduct)
      );
    } catch ({ message }) {
      console.error("======ProductController.createProduct===\n", message);
      return res
        .status(500)
        .json(formatResponse(500, "Ошибка создания продукта", null, message));
    }
  }
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.updateProduct(id, req.body);
      if (!product) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Ошибка обновления продукта",
              null,
              "Ошибка обновления продукта"
            )
          );
      }
      return res.json(formatResponse(200, "Продукт обновлен успешно", product));
    } catch ({ message }) {
      console.error("======ProductController.updateProduct===\n", message);
      return res
        .status(500)
        .json(formatResponse(500, "Ошибка обновления продукта", null, message));
    }
  }
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.deleteProduct(id);
      if (!product) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Ошибка удаления продукта",
              null,
              "Ошибка удаления продукта"
            )
          );
      }
      return res.json(formatResponse(200, "Продукт удален успешно", product));
    } catch ({ message }) {
      console.error("======ProductController.deleteProduct===\n", message);
      return res
        .status(500)
        .json(formatResponse(500, "Ошибка удаления продукта", null, message));
    }
  }
}

module.exports = ProductController;
