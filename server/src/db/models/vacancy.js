"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vacancy extends Model {
    static associate(models) {
      // Пока нет связей с другими таблицами
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
