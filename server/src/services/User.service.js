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
  static async update(id, userData) {
    const userToUpdate = await User.findByPk(id);
    if (userData.login) {
      userToUpdate.login = userData.login;
    }
    if (userData.password) {
      userToUpdate.password = userData.password;
    }
    if (userData.phone) {
      userToUpdate.phone = userData.phone;
    }
    if (userData.role_id) {
      userToUpdate.role_id = userData.role_id;
    }
    await userToUpdate.save();
    return userToUpdate;
  }
  static async delete(id) {
    const deletedUser = await User.findByPk(id);
    await User.destroy({ where: { id } });
    return deletedUser;
  }
}

module.exports = UserService;