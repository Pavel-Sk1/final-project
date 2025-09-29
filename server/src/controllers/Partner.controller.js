const PartnerService = require("../services/Partner.service");
const formatResponse = require("../utils/formatResponse");

class PartnerController {
  static async getAllPartners(req, res) {
    try {
      const partners = await PartnerService.getAllPartners();
      if (!partners) {
        return res
          .status(404)
          .json(formatResponse(404, "Партнеры не найдены", null));
      }
      return res.json(
        formatResponse(200, "Партнеры получены успешно", partners)
      );
    } catch ({ message }) {
      console.error("======PartnerController.getAllPartners===\n", message);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при получении партнеров", null, message)
        );
    }
  }
  static async getPartnerById(req, res) {
    try {
      const partner = await PartnerService.getPartnerById(req.params.id);
      if (!partner) {
        return res
          .status(404)
          .json(formatResponse(404, "Партнер не найден", null));
      }
      return res.json(formatResponse(200, "Партнер получен успешно", partner));
    } catch ({ message }) {
      console.error("======PartnerController.getPartnerById===\n", message);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при получении партнера", null, message)
        );
    }
  }
  static async createPartner(req, res) {
    try {
      const partner = await PartnerService.createPartner(req.body);
      if (!partner) {
        return res
          .status(400)
          .json(formatResponse(400, "Партнер не создан", null));
      }
      return res.json(formatResponse(200, "Партнер создан успешно", partner));
    } catch ({ message }) {
      console.error("======PartnerController.createPartner===\n", message);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при создании партнера", null, message)
        );
    }
  }
  static async updatePartner(req, res) {
    try {
      const partner = await PartnerService.updatePartner(
        req.params.id,
        req.body
      );
      if (!partner) {
        return res
          .status(400)
          .json(formatResponse(400, "Партнер не обновлен", null));
      }
      return res.json(formatResponse(200, "Партнер обновлен успешно", partner));
    } catch ({ message }) {
      console.error("======PartnerController.updatePartner===\n", message);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при обновлении партнера", null, message)
        );
    }
  }
  static async deletePartner(req, res) {
    try {
      const partner = await PartnerService.deletePartner(req.params.id);
      if (!partner) {
        return res
          .status(400)
          .json(formatResponse(400, "Партнер не удален", null));
      }
      return res.json(formatResponse(200, "Партнер удален успешно", partner));
    } catch ({ message }) {
      console.error("======PartnerController.deletePartner===\n", message);
      return res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при удалении партнера", null, message)
        );
    }
  }
}

module.exports = PartnerController;
