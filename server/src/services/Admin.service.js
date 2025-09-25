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

  static async updateNews(id, news) {
    const { title, description, img, is_active } = news;
    const newsToUpdate = await News.findByPk(id);

    if (title) {
      newsToUpdate.title = title;
    }
    if (description) {
      newsToUpdate.description = description;
    }
    if (img) {
      newsToUpdate.img = img;
    }   
     
    newsToUpdate.is_active = is_active;
    
    await newsToUpdate.save();
    return newsToUpdate;
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