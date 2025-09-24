const router = require('express').Router();
const formatResponse = require('../utils/formatResponse');
const authRoutes = require('./auth.routes');
const adminRouter = require('./admin.routes');
const newsRoutes = require('./news.routes');
const productsRoutes = require('./products.routes');


router.use('/auth', authRoutes);
router.use("/admin", adminRouter);
router.use('/news', newsRoutes);
router.use('/products', productsRoutes);

router.use((req, res) => {
    res
      .status(404)
      .json(formatResponse(404, 'Маршрут не найден', null, 'Маршрут не найден'));
  });

  module.exports = router;