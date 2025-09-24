const { News, Product } = require("../db/models");

class AdminService {

  static async getAllNews() {
    return await News.findAll();
  }

  static async getNewsById(id) {
    return await News.findByPk(id);
  }

  static async createNews(information) {
    return await News.create(information);
  }

  static async updateNews(id, information) {
    const { title, description, img, is_active } = information;
    const informationToUpdate = await News.findByPk(id);

    if (title) {
      informationToUpdate.title = title;
    }
    if (description) {
      informationToUpdate.description = description;
    }
    if (img) {
      informationToUpdate.img = img;
    }
    if (is_active) {
      informationToUpdate.is_active = is_active;
    }
    await informationToUpdate.save();
    return informationToUpdate;
  }

  static async deleteNews(id) {
    return await News.destroy({ where: { id } });
  }

  static async getAllProducts() {
    return await Product.findAll();
  }

  static async getProductById(id) {
    return await Product.findByPk(id);
  }

  static async updateProduct(id, product) {
    const { name, img } = product;
    const productToUpdate = await Product.findByPk(id);
    if (name) {
      productToUpdate.name = name;
    }
    if (img) {
      productToUpdate.img = img;
    }
    await productToUpdate.save();
    return productToUpdate;
  }
}

module.exports = AdminService;