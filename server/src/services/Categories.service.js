const { Category } = require('../db/models');

class CategoriesService {
    static async getAllCategories() {
        return await Category.findAll();
    }
}
module.exports = CategoriesService;