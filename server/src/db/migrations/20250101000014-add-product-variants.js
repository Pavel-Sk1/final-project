"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем поле для вариантов товара
    await queryInterface.addColumn("Products", "variants", {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: "Варианты товара (например: ж/п для пирогов)",
    });

    // Добавляем поле для названий вариантов
    await queryInterface.addColumn("Products", "variant_names", {
      type: Sequelize.JSONB,
      allowNull: true,
      comment: "Названия вариантов (например: ['жареный', 'печеный'])",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "variants");
    await queryInterface.removeColumn("Products", "variant_names");
  },
};
