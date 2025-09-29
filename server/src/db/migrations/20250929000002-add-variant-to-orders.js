"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tg_orders", "variant", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Вариант товара (ж/п для пирогов, м/б для салатов)",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("tg_orders", "variant");
  },
};
