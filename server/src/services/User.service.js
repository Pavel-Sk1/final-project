const { User } = require('../db/models');
const { Role } = require('../db/models');

class UserService {
  static async getByLogin(login) {
    return (await User.findOne({ where: { login }, include: [{ model: Role, as: 'role', attributes: ['name'] }] }))?.get();
  }

  static async create(userData) {
    return await User.create(userData);
  }
}

module.exports = UserService;