const formatResponse = require('../utils/formatResponse');
const ProductService = require('../services/Product.service');

class ProductController {
  static async getList(req, res) {
    try {
      const products = await ProductService.getActiveOrdered(40);
      return res.json(formatResponse(200, 'OK', products));
    } catch ({ message }) {
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка получения продуктов', null, message));
    }
  }
}

module.exports = ProductController;


