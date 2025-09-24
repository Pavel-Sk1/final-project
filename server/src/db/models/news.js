"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      // Пока нет связей с другими таблицами
    }
    static validate({ title, description, img, is_active }) {
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return {
          isValid: false,
          error: "Название новости не должно быть пустым",
        };
      }
      if (
        !description ||
        typeof description !== "string" ||
        description.trim().length === 0
      ) {
        return {
          isValid: false,
          error: "Описание новости не должно быть пустым",
        };
      }
      if (!img || typeof img !== "string" || img.trim().length === 0) {
        return {
          isValid: false,
          error: "Изображение новости не должно быть пустым",
        };
      }
      if (typeof is_active !== "boolean") {
        return {
          isValid: false,
          error: "Активность новости должна быть булевым значением",
        };
      }
      return { isValid: true, error: null };
    }
  }

  News.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "News",
      tableName: "news",
      timestamps: true,
    }
  );

  return News;
};
