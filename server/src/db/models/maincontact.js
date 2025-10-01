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
      if (typeof phone !== 'string') {
        return false;
      }
      // Допустимые форматы: 
      // +7-(999)-999-99-99, +7 (999) 999-99-99, +7 999 999 99 99, 89999999999
      const prettyPattern = /^\+7[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
      const digits = phone.replace(/\D/g, '');
      if (digits.length !== 11) return false;
      if (!(digits.startsWith('7') || digits.startsWith('8'))) return false;
      return prettyPattern.test(phone) || true; // после цифровой проверки формат считается валидным
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
      const addressPattern = /^((проспект)|(бульвар)|(улица))\s*([\p{L}\s.-]+),\s*(\d+),\s*([\p{L}\s.-]+)$/u;
      return addressPattern.test(address.trim());
    }
    static validate({ email, phone, telegram, address }) {
      if (email !== undefined && email !== null && String(email).length > 0) {
        if (!this.validateEmail(String(email))) {
          return { isValid: false, error: 'Некорректный email' };
        }
      }
      if (phone !== undefined && phone !== null && String(phone).length > 0) {
        if (!this.validatePhone(String(phone))) {
          return { isValid: false, error: 'Некорректный телефон. Пример: +7 (999) 999-99-99 или 89999999999' };
        }
      }
      if (telegram !== undefined && telegram !== null && String(telegram).length > 0) {
        if (!this.validateTelegram(String(telegram))) {
          return { isValid: false, error: 'Некорректная ссылка Telegram' };
        }
      }
      if (address !== undefined && address !== null && String(address).length > 0) {
        if (!this.validateAddress(String(address))) {
          return { isValid: false, error: "Некорректный адрес. Формат: 'Улица, Номер дома, Город'" };
        }
      }
      return { isValid: true, error: null };
    }
  }
  MainContact.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    telegram: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'MainContact',
  });
  return MainContact;
}