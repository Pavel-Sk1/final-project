const { Product } = require("../db/models");

class ProductService {
  static async getActiveOrdered() {
    return await Product.findAll({
      where: { is_active: true },
      attributes: ["id", "img"],
      order: [["createdAt", "DESC"]],
    });
  }
  static async getAllProducts() {
    return await Product.findAll();
  }
  static async createProduct(product) {
    return await Product.create(product);
  }
  static async updateProduct(id, product) {
    const {
      name,
      img,
      price,
      recipe,
      weight,
      category_id,
      is_active,
      variants,
      variant_names,
    } = product;
    const productToUpdate = await Product.findByPk(id);
    if (name) {
      productToUpdate.name = name;
    }
    if (img) {
      productToUpdate.img = img;
    }
    if (price) {
      productToUpdate.price = price;
    }
    if (recipe) {
      productToUpdate.recipe = recipe;
    }
    if (weight) {
      productToUpdate.weight = weight;
    }
    if (category_id) {
      productToUpdate.category_id = category_id;
    }
    productToUpdate.is_active = is_active;
    if (variants && Array.isArray(variants) && variants.length > 0) {
      productToUpdate.variants = variants;
    }
    if (
      variant_names &&
      Array.isArray(variant_names) &&
      variant_names.length > 0
    ) {
      productToUpdate.variant_names = variant_names;
    }

    await productToUpdate.save();
    return productToUpdate;
  }
  static async deleteProduct(id) {
    const deletedProduct = await Product.findByPk(id);
    await Product.destroy({ where: { id } });
    return deletedProduct;
  }
}

module.exports = ProductService;
