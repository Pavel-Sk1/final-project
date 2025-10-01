"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("admin123!", 10);

    await queryInterface.bulkInsert(
      "Users",
      [
        {          
          login: "admin",
          password: hashedPassword,
          phone: "+7 (999) 123-45-67",
          role_id: 1, // admin
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {          
          login: "user1",
          password: hashedPassword,
          phone: "+7 (999) 345-67-89",
          role_id: 2, // user
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
