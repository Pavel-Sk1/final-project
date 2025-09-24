"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Роль может принадлежать многим пользователям
      Role.hasMany(models.User, {
        foreignKey: "role_id",
        as: "users",
      });
    }
  }

  Role.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};
