const router = require('express').Router();
const ProductController = require('../controllers/Product.controller');

router.get('/', ProductController.getList);

module.exports = router;

