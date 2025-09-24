const { News } = require('../db/models');

class NewsService {
  static async getActiveOrdered(limit = 20) {
    return await News.findAll({
      where: { is_active: true },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }
}

module.exports = NewsService;


