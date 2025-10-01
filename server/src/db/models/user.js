"use strict";

const bcrypt = require("bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
      User.hasOne(models.Partner, {
        foreignKey: "user_id",
        as: "partner",
      });
    }

    static validateEmail(email) {
      const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
      return emailPattern.test(email);
    }
    static validatePassword(password) {
      const hasUpperCase = /[A-Z]/;
      const hasLowerCase = /[a-z]/;
      const hasNumbers = /\d/;
      const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
      const isValidLength = password.length >= 8;

      if (
        !hasUpperCase.test(password) ||
        !hasLowerCase.test(password) ||
        !hasNumbers.test(password) ||
        !hasSpecialCharacters.test(password) ||
        !isValidLength
      ) {
        return false;
      }

      return true;
    }

    static validateSignInData({ login, password }) {
      if (!login || typeof login !== "string" || login.trim().length === 0) {
        return {
          isValid: false,
          error: "Логин не должен быть пустым",
        };
      }

      if (
        !password ||
        typeof password !== "string" ||
        password.trim().length === 0
      ) {
        return {
          isValid: false,
          error: "Пароль не должен быть пустым",
        };
      }

      return {
        isValid: true,
        error: null,
      };
    }

    static validateSignUpData({ login, password }) {
      if (!login || typeof login !== "string" || login.trim().length === 0) {
        return {
          isValid: false,
          error: "Поле login не должно быть пустым",
        };
      }

      if (
        !password ||
        typeof password !== "string" ||
        password.trim().length === 0 ||
        !this.validatePassword(password)
      ) {
        return {
          isValid: false,
          error:
            "Пароль не должен быть пустым, должен содержать одну большую букву, одну маленькую, один специальный символ, и не должен быть короче 8 символов",
        };
      }      

      return {
        isValid: true,
        error: null,
      };
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
      hooks: {
        //* перед созданием
        beforeCreate: async (newUser) => {
          //* хэшируем пароль
          const hashedPassword = await bcrypt.hash(newUser.password, 10);
          newUser.password = hashedPassword;
          //* приводим login к нижнему регистру
          newUser.login = newUser.login.trim().toLowerCase();
        },
        //* после создания
        afterCreate: (newUser) => {
          const rawUser = newUser.get();
          delete rawUser.password;
          return rawUser;
        },
      },
    }
  );
  return User;
};
