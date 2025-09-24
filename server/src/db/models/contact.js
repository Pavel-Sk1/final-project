"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      // Пока нет связей с другими таблицами
    }
  }

  Contact.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Contact",
      tableName: "contacts",
      timestamps: true,
    }
  );

  return Contact;
};
