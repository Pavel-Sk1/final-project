"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vacancy extends Model {
    static associate(models) {
      // Пока нет связей с другими таблицами
    }
    static validate({ position, location, salary, description, is_active }) {
      if (!position || typeof position !== "string" || position.trim().length === 0) {
        return {
          isValid: false,
          error: "Название вакансии не должно быть пустым",
        };
      }
    if (!location || typeof location !== "string" || location.trim().length === 0) {
      return {
        isValid: false,
        error: "Местоположение вакансии не должно быть пустым",
      };
    }
    if (!salary || typeof salary !== "string" || salary.trim().length === 0) {
      return {
        isValid: false,
        error: "Зарплата вакансии не должна быть пустой",
      };
    }
    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return {
        isValid: false,
        error: "Описание вакансии не должно быть пустым",
      };
    }
    if (typeof is_active !== "boolean") {
      return {
        isValid: false,
        error: "Активность вакансии должна быть булевым значением",
      };
    }
    return { isValid: true, error: null };
  }
}
  
  Vacancy.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salary: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
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
      modelName: "Vacancy",
      tableName: "vacancies",
      timestamps: true,
    }
  );

  return Vacancy;
};
