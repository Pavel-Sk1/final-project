"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    static associate(models) {
      Partner.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
    static validatePhone(phone) {
      if (typeof phone !== 'string') {
        return false;
      }
      const prettyPattern = /^\+7[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
      const digits = phone.replace(/\D/g, '');
      if (digits.length !== 11) return false;
      if (!(digits.startsWith('7') || digits.startsWith('8'))) return false;
      return prettyPattern.test(phone) || true; // после цифровой проверки формат считается валидным
    }
    static validateEmail(email) {
      const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
      return emailPattern.test(email);
    }
    static validateAddress(address) {
      if (typeof address !== 'string') {
        return false;
      }
      const addressPattern = /^((проспект)|(бульвар)|(улица))\s*([\p{L}\s.-]+),\s*(\d+),\s*([\p{L}\s.-]+)$/u;
      return addressPattern.test(address.trim());
    }
  }

  Partner.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      inn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ogrn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_person: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Partner",
      tableName: "partner",
      timestamps: true,
    }
  );

  return Partner;
};
