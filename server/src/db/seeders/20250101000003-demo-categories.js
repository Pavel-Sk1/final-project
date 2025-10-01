"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          name: "Пироги",
          description: "Классическая итальянская пицца с различными начинками",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Хот-Доги",
          description: "Сочные бургеры с мясом и овощами",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Тесто",
          description: "Холодные и горячие напитки",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Готовые блюда",
          description: "Сладкие десерты и выпечка",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
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
