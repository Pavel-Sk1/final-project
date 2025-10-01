"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "MainContacts",
      [
        {
          user_id: 1,
          name: "Ресторан 'Главный'",
          email: "info@restaurant.ru",
          phone: 1234567234,
          telegram: "https://t.me/restaurant_main",
          address: "ул. Проспект строителей, 12, Иваново",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("MainContacts", null, {});
  },
};
