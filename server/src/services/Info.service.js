const { Product } = require('../db/models');

class InfoService {
  static async getProducts() {
    return await Product.findAll({
      attributes: ['name', 'price'],
    });
  }
}

module.exports = InfoService;
