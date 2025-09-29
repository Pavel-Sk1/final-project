'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MainContact extends Model {
    static associate(models) {
      MainContact.belongsTo(models.User, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "user",
      });
    }
    static validateEmail(email) {
      const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
      return emailPattern.test(email);
    }
    static validatePhone(phone) {
      const phonePattern = /^\+7\d{10}$/;
      return phonePattern.test(phone);
    }
    static validateTelegram(telegram) {
      if (typeof telegram !== 'string') {
        return false;
      }
      const urlPattern = /^https?:\/\/(www\.)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]+$/;
      return urlPattern.test(telegram);
    }
    static validateAddress(address) {
      if (typeof address !== 'string') {
        return false;
      }
      const addressPattern = /^([\p{L}\d\s.,-]+),\s*([\d\w-]+),\s*([\p{L}\d\s.,-]+)$/u;
      return addressPattern.test(address);
    }
  }
  MainContact.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    telegram: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'MainContact',
  });
  return MainContact;
}