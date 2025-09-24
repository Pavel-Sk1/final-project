"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      // Пока нет связей с другими таблицами
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
      discription: {
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
