const { Vacancy } = require('../db/models');

class VacancyService {
    static async getActiveOrdered() {
        return await Vacancy.findAll({
            where: { is_active: true },
            order: [['createdAt', 'DESC']],
        });
    }
}

module.exports = VacancyService;