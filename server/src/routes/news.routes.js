const router = require('express').Router();
const NewsController = require('../controllers/News.controller');

router.get('/', NewsController.getList);

module.exports = router;

