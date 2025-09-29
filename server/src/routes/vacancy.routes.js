const express = require('express');
const VacancyController = require('../controllers/Vacancy.controller');

const router = express.Router();

router.get('/', VacancyController.getActiveOrdered);

module.exports = router;