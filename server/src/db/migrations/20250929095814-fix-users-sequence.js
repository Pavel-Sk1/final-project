"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Исправляем sequence для таблицы Users
    // Устанавливаем sequence на максимальный ID + 1
    await queryInterface.sequelize.query(
      `SELECT setval('"Users_id_seq"', (SELECT MAX(id) FROM "Users"))`
    );
  },

  async down(queryInterface, Sequelize) {
    // В случае отката миграции, сбрасываем sequence на 1
    await queryInterface.sequelize.query(
      `SELECT setval('"Users_id_seq"', 1, false)`
    );
  },
};
