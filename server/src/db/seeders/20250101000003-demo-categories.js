"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          id: 1,
          name: "Пицца",
          description: "Классическая итальянская пицца с различными начинками",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Бургеры",
          description: "Сочные бургеры с мясом и овощами",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Напитки",
          description: "Холодные и горячие напитки",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Десерты",
          description: "Сладкие десерты и выпечка",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Салаты",
          description: "Свежие салаты с различными ингредиентами",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
