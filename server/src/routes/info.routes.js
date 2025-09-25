const router = require('express').Router();
const InfoController = require('../controllers/Info.controller');

router.get('/products', InfoController.getProducts);

module.exports = router;
