"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "authorized_users",
      [
        {
          tg_user_id: "870993655", // Ваш Telegram ID
          tg_username: null,
          first_name: "Admin",
          last_name: "User",
          role: "admin",
          is_active: true,
          added_by: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("authorized_users", null, {});
  },
};
