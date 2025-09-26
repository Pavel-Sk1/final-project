const formatResponse = require('../utils/formatResponse');
const VacancyService = require('../services/Vacancy.service');

class VacancyController {
    static async getActiveOrdered(req, res) {
        try {
            const vacancies = await VacancyService.getActiveOrdered();
            return res.json(formatResponse(200, 'OK', vacancies));
        } catch (error) {
            return res
                .status(500)
                .json(formatResponse(500, 'Ошибка получения вакансий', null, error.message));
        }
    }
}

module.exports = VacancyController;
        