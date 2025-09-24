"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("authorized_users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tg_user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: "Telegram ID пользователя",
      },
      tg_username: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Telegram username",
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Имя пользователя",
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Фамилия пользователя",
      },
      role: {
        type: Sequelize.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
        comment: "Роль пользователя",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Активен ли пользователь",
      },
      added_by: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Кто добавил пользователя",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("authorized_users");
  },
};
