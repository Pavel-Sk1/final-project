const formatResponse = require('../utils/formatResponse');
const NewsService = require('../services/News.service');

class NewsController {
  static async getList(req, res) {
    try {
      const news = await NewsService.getActiveOrdered(20);
      return res.json(formatResponse(200, 'OK', news));
    } catch ({ message }) {
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка получения новостей', null, message));
    }
  }
}

module.exports = NewsController;


