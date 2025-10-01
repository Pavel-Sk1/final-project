"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "partner",
      [
        {          
          company_name: "ООО 'Свежие продукты'",
          inn: "1234567890",
          ogrn: "1234567890123",
          address: "Москва, ул. Ленина, 10, офис 5",
          contact_person: "Иванов Иван Иванович",
          contact_email: "ivanov@fresh-products.ru",
          contact_phone: "+7 (495) 123-45-67",
          comment: "Поставщик свежих овощей и зелени",
          status: "active",
          user_id: 2, // user1
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("partner", null, {});
  },
};
