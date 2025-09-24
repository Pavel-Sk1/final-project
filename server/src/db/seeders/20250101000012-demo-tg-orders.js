"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tg_orders",
      [
        {
          id: 1,
          tg_user_id: 1, // Анна Петрова
          product_id: 1, // Маргарита
          quantity: 1,
          user_comment: "Без лука, пожалуйста",
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          tg_user_id: 1, // Анна Петрова
          product_id: 6, // Кока-Кола
          quantity: 2,
          user_comment: "",
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          tg_user_id: 2, // Михаил Иванов
          product_id: 4, // Классический бургер
          quantity: 1,
          user_comment: "Дополнительный соус",
          status: "in_progress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          tg_user_id: 2, // Михаил Иванов
          product_id: 7, // Апельсиновый сок
          quantity: 1,
          user_comment: "",
          status: "in_progress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          tg_user_id: 3, // Елена Смирнова
          product_id: 2, // Пепперони
          quantity: 1,
          user_comment: "Острая пицца",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          tg_user_id: 4, // Дмитрий Козлов
          product_id: 5, // Чизбургер
          quantity: 2,
          user_comment: "Один без лука",
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          tg_user_id: 4, // Дмитрий Козлов
          product_id: 10, // Цезарь
          quantity: 1,
          user_comment: "",
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          tg_user_id: 5, // Ольга Васильева
          product_id: 3, // Четыре сыра
          quantity: 1,
          user_comment: "Дополнительный сыр",
          status: "cancelled",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          tg_user_id: 6, // Алексей Морозов
          product_id: 8, // Тирамису
          quantity: 2,
          user_comment: "На десерт",
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          tg_user_id: 7, // Татьяна Новикова
          product_id: 9, // Чизкейк
          quantity: 1,
          user_comment: "С днем рождения!",
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 11,
          tg_user_id: 8, // Сергей Волков
          product_id: 1, // Маргарита
          quantity: 1,
          user_comment: "Быстрая доставка",
          status: "in_progress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 12,
          tg_user_id: 8, // Сергей Волков
          product_id: 6, // Кока-Кола
          quantity: 1,
          user_comment: "",
          status: "in_progress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tg_orders", null, {});
  },
};
