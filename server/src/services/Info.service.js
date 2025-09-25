const { Product } = require('../db/models');

class InfoService {
  static async getProducts() {
    return await Product.findAll({
      attributes: ['name', 'price', 'weight'],
    });
  }
}

module.exports = InfoService;
