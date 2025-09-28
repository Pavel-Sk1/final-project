const router = require('express').Router();
const ProductController = require('../controllers/Product.controller');

router.get('/', ProductController.getList);
router.post('/', ProductController.createProduct);
module.exports = router;

