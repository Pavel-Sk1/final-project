const router = require('express').Router();
const formatResponse = require('../utils/formatResponse');
const authRoutes = require('./auth.routes');
const NewsController = require('../controllers/News.controller');

router.use('/auth', authRoutes);
// router.use("/admin", adminRouter);

router.get('/news', NewsController.getList);

router.use((req, res) => {
    res
      .status(404)
      .json(formatResponse(404, 'Маршрут не найден', null, 'Маршрут не найден'));
  });

  module.exports = router;