const MainContactService = require("../services/MainContact.service");
const formatResponse = require("../utils/formatResponse");

class MainContactController {
    static async getMainContact(req, res) {
        try {
            const mainContact = await MainContactService.getMainContact();
            return res.json(formatResponse(200, "OK", mainContact));
        } catch ({ message }) {
            return res.status(500).json(formatResponse(500, "Ошибка при получении контактов", null, message));
        }
    }
}

module.exports = MainContactController;