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
    static validate({ name, img, price, recipe }) {
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return {
          isValid: false,
          error: "Название продукта не должно быть пустым",
        };
      }
      if (!price || typeof price !== "number" || price < 0) {
        return {
          isValid: false,
          error: "Цена продукта не должна быть пустой и должна быть числом",
        };
      }
      if (!img || typeof img !== "string" || img.trim().length === 0) {
        return {
          isValid: false,
          error: "Изображение продукта не должно быть пустым",
        };
      }
      if (!recipe || typeof recipe !== "string" || recipe.trim().length === 0) {
        return {
          isValid: false,
          error: "Рецепт продукта не должен быть пустым",
        };
      }
      return { isValid: true, error: null };
    }
    static validateImg({ img }) {
      if (!img || typeof img !== "string" || img.trim().length === 0) {
        return {
          isValid: false,
          error: "Изображение продукта не должно быть пустым",
        };
      }
      return { isValid: true, error: null };
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
      variants: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Варианты товара (например: ж/п для пирогов)",
      },
      variant_names: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Названия вариантов (например: ['жареный', 'печеный'])",
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
