const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AuthorizedUser extends Model {
    static associate(models) {
      // Здесь можно добавить связи с другими моделями при необходимости
    }
  }

  AuthorizedUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tg_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: "Telegram ID пользователя",
      },
      tg_username: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Telegram username",
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Имя пользователя",
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Фамилия пользователя",
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
        comment: "Роль пользователя",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Активен ли пользователь",
      },
      added_by: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Кто добавил пользователя",
      },
    },
    {
      sequelize,
      modelName: "AuthorizedUser",
      tableName: "authorized_users",
      timestamps: true,
    }
  );

  return AuthorizedUser;
};
