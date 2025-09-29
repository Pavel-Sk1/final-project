const router = require('express').Router();
const ProductController = require('../controllers/Product.controller');
const checkRole = require('../middleware/checkRole');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router.get('/', ProductController.getList);
router.get('/all', ProductController.getAllProducts);
router.post('/', verifyAccessToken, checkRole('admin'), ProductController.createProduct);
router.put('/:id', verifyAccessToken, checkRole('admin'), ProductController.updateProduct);
router.delete('/:id', verifyAccessToken, checkRole('admin'), ProductController.deleteProduct);
module.exports = router;

