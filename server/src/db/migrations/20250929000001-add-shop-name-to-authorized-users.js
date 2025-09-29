"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("authorized_users", "shop_name", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Название магазина пользователя",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("authorized_users", "shop_name");
  },
};
