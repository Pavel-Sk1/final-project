const { User, Role, Partner } = require('../db/models');

class UserService {
  static async getByLogin(login) {
    const user = await User.findOne({ 
      where: { login }, 
      include: [
        { model: Role, as: 'role', attributes: ['name'] },
        { model: Partner, as: 'partner' }
      ] 
    });
    
    return user ? user.get() : null;
  }

  static async create(userData) {
    return await User.create(userData);
  }
}

module.exports = UserService;