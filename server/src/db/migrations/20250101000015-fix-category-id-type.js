"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

    await queryInterface.addConstraint('partner', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_partner_user_id',
      references: {
        table: 'Users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('partner', 'fk_partner_user_id');

    await queryInterface.changeColumn("Products", "category_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
