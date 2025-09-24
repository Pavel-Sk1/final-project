"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Продукт принадлежит одной категории
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      // Продукт может быть в многих заказах
      Product.hasMany(models.TgOrder, {
        foreignKey: "product_id",
        as: "orders",
      });
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipe: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
      },
      is_active: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      timestamps: true,
    }
  );

  return Product;
};
