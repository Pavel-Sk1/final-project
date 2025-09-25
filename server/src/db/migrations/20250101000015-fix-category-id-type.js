"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Исправляем тип category_id в таблице Products
    await queryInterface.changeColumn("Products", "category_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    // Возвращаем обратно к STRING (если нужно)
    await queryInterface.changeColumn("Products", "category_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
