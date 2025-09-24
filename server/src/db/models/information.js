"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Information extends Model {
    static associate(models) {
      // Пока нет связей с другими таблицами
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
