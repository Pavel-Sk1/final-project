const { User } = require('../db/models');

class UserService {
  static async getByEmail(email) {
    return (await User.findOne({ where: { email } }))?.get();
  }

  static async create(userData) {
    return await User.create(userData);
  }
}

module.exports = UserService;