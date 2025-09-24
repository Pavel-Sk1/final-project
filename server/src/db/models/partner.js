"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    static associate(models) {
      // Пока нет связей с другими таблицами
    }
  }

  Partner.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      inn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ogrn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_person: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comment: {
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
      modelName: "Partner",
      tableName: "partner",
      timestamps: true,
    }
  );

  return Partner;
};
