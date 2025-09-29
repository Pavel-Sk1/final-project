const CategoriesService = require("../services/Categories.service");
const formatResponse = require("../utils/formatResponse");

class CategoriesController {
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoriesService.getAllCategories();
      if (!categories) {
        return res.status(404).json(formatResponse(404, "Категории не найдены", null));
      }
      res.status(200).json(formatResponse(200, "Категории получены успешно", categories));
    } catch (error) {
      console.error("======CategoriesController.getAllCategories===\n", error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }
}
module.exports = CategoriesController;
