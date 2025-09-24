"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "partner",
      [
        {
          id: 1,
          company_name: "ООО 'Свежие продукты'",
          inn: "1234567890",
          ogrn: "1234567890123",
          address: "Москва, ул. Ленина, 10, офис 5",
          contact_person: "Иванов Иван Иванович",
          contact_email: "ivanov@fresh-products.ru",
          contact_phone: "+7 (495) 123-45-67",
          comment: "Поставщик свежих овощей и зелени",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          company_name: "ИП Петров А.А.",
          inn: "0987654321",
          ogrn: "9876543210987",
          address: "Московская область, г. Подольск, ул. Мира, 15",
          contact_person: "Петров Алексей Александрович",
          contact_email: "petrov@meat-supplier.ru",
          contact_phone: "+7 (496) 234-56-78",
          comment: "Поставщик мясных продуктов",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          company_name: "ЗАО 'Молочные продукты'",
          inn: "1122334455",
          ogrn: "1122334455667",
          address: "Москва, ул. Молочная, 25",
          contact_person: "Сидорова Мария Петровна",
          contact_email: "sidorova@dairy.ru",
          contact_phone: "+7 (495) 345-67-89",
          comment: "Поставщик молочных продуктов и сыров",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          company_name: "ООО 'Напитки и соки'",
          inn: "5566778899",
          ogrn: "5566778899001",
          address: "Москва, ул. Напиточная, 30",
          contact_person: "Козлов Дмитрий Сергеевич",
          contact_email: "kozlov@beverages.ru",
          contact_phone: "+7 (495) 456-78-90",
          comment: "Поставщик безалкогольных напитков",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          company_name: "ИП Смирнова Е.В.",
          inn: "9988776655",
          ogrn: "9988776655443",
          address: "Москва, ул. Хлебная, 12",
          contact_person: "Смирнова Елена Владимировна",
          contact_email: "smirnova@bakery.ru",
          contact_phone: "+7 (495) 567-89-01",
          comment: "Поставщик хлебобулочных изделий",
          status: "inactive",
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
