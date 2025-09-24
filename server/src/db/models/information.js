"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Information extends Model {
    static associate(models) {
      // Пока нет связей с другими таблицами
    }
    static validate({ title, description, img }) {
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return {
          isValid: false,
          error: "Название информации не должно быть пустым",
        };
      }
      if (!description || typeof description !== "string" || description.trim().length === 0) {
        return {
          isValid: false,
          error: "Описание информации не должно быть пустым",
        };
      }
      if (!img || typeof img !== "string" || img.trim().length === 0) {
        return {
          isValid: false,
          error: "Изображение информации не должно быть пустым",
        };
      }
      return { isValid: true, error: null };
    }
  }

  Information.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      page: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Information",
      tableName: "information",
      timestamps: true,
    }
  );

  return Information;
};
