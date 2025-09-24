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
          id: 1,
          login: "admin",
          password: hashedPassword,
          phone: "+7 (999) 123-45-67",
          role_id: 1, // admin
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          login: "manager1",
          password: hashedPassword,
          phone: "+7 (999) 234-56-78",
          role_id: 2, // manager
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          login: "user1",
          password: hashedPassword,
          phone: "+7 (999) 345-67-89",
          role_id: 3, // user
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          login: "moderator1",
          password: hashedPassword,
          phone: "+7 (999) 456-78-90",
          role_id: 4, // moderator
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
