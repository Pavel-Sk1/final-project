"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TgUser extends Model {
    static associate(models) {
      // Telegram пользователь может иметь много заказов
      TgUser.hasMany(models.TgOrder, {
        foreignKey: "tg_user_id",
        sourceKey: "tg_user_id",
        as: "orders",
      });
    }
  }

  TgUser.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tg_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tg_username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TgUser",
      tableName: "tg_users",
      timestamps: true,
    }
  );

  return TgUser;
};
