const { Product } = require('../db/models');

class ProductService {
  static async getActiveOrdered() {
    return await Product.findAll({
      where: { is_active: 1 },
      attributes: ['id', 'img'],
      order: [['createdAt', 'DESC']],
    });
  }
  static async getAllProducts() {
    return await Product.findAll();
  }
  static async createProduct(product) {
    return await Product.create(product);
  }
}

module.exports = ProductService;

