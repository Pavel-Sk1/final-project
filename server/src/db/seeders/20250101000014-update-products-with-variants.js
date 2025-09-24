"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Обновляем пироги с вариантами
    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с капустой",
      }
    );

    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с курицей",
      }
    );

    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с мясом",
      }
    );

    // Обновляем салаты с вариантами
    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["м", "б"]),
        variant_names: JSON.stringify(["маленький", "большой"]),
      },
      {
        name: "Салат мрамор",
      }
    );

    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["м", "б"]),
        variant_names: JSON.stringify(["маленький", "большой"]),
      },
      {
        name: "Цезарь",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Убираем варианты
    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: null,
        variant_names: null,
      },
      {
        name: [
          "Пирог с капустой",
          "Пирог с курицей",
          "Пирог с мясом",
          "Салат мрамор",
          "Цезарь",
        ],
      }
    );
  },
};
