const formatResponse = require('../utils/formatResponse');
const InfoService = require('../services/Info.service');

class InfoController {
  static async getProducts(req, res) {
    try {
      const products = await InfoService.getProducts();
      return res.json(formatResponse(200, 'OK', products));
    } catch ({ message }) {
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка получения продуктов', null, message));
    }
  }
}

module.exports = InfoController;
