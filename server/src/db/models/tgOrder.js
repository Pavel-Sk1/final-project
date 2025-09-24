"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TgOrder extends Model {
    static associate(models) {
      // Заказ принадлежит одному Telegram пользователю
      TgOrder.belongsTo(models.TgUser, {
        foreignKey: "tg_user_id",
        as: "tgUser",
      });

      // Заказ принадлежит одному продукту
      TgOrder.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }

  TgOrder.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tg_user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "tg_users",
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      user_comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TgOrder",
      tableName: "tg_orders",
      timestamps: true,
    }
  );

  return TgOrder;
};
