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

    // Обновляем остальные пироги с вариантами жар/печ
    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с яйцом жар/печ",
      }
    );

    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с картошкой жар/печ",
      }
    );

    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с повидло жар/печ",
      }
    );

    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с творогом жар/печ",
      }
    );

    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с печенкой жар/печ",
      }
    );

    await queryInterface.bulkUpdate(
      "Products",
      {
        variants: JSON.stringify(["ж", "п"]),
        variant_names: JSON.stringify(["жареный", "печеный"]),
      },
      {
        name: "Пирог с зеленым луком и яйцом жар/печ",
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
          "Пирог с яйцом жар/печ",
          "Пирог с картошкой жар/печ",
          "Пирог с повидло жар/печ",
          "Пирог с творогом жар/печ",
          "Пирог с печенкой жар/печ",
          "Пирог с зеленым луком и яйцом жар/печ",
        ],
      }
    );
  },
};
