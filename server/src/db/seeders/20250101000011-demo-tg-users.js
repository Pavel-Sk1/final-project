"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tg_users",
      [
        {
          id: 9,
          tg_user_id: "870993655",
          tg_username: "developer",
          first_name: "Developer",
          last_name: "User",
          phone: "+7 (999) 999-99-99",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tg_users", null, {});
  },
};
