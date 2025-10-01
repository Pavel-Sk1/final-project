"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "contacts",
      [
        {
          type: "phone",
          value: "+7 (495) 123-45-67",
          label: "Основной телефон",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "phone",
          value: "+7 (495) 234-56-78",
          label: "Телефон доставки",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "email",
          value: "info@restaurant.ru",
          label: "Общая почта",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "email",
          value: "orders@restaurant.ru",
          label: "Заказы",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "address",
          value: "Москва, ул. Тверская, 15",
          label: "Основной ресторан",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "address",
          value: "Москва, ул. Арбат, 25",
          label: "Филиал на Арбате",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "social",
          value: "@restaurant_moscow",
          label: "Instagram",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "social",
          value: "restaurant.moscow",
          label: "Telegram",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "working_hours",
          value: "10:00 - 23:00",
          label: "Ежедневно",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "working_hours",
          value: "10:00 - 02:00",
          label: "Доставка",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("contacts", null, {});
  },
};
