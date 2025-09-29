const { MainContact } = require("../db/models");

class MainContactService {
    static async getMainContact() {
        return await MainContact.findAll({
            attributes: ["id", "user_id", "name", "email", "phone", "telegram", "address", "createdAt", "updatedAt"],
        });
    }
}

module.exports = MainContactService;