const categoriesRouter = require('express').Router();
const CategoriesController = require('../controllers/Categories.controller');

categoriesRouter.get('/', CategoriesController.getAllCategories);

module.exports = categoriesRouter;