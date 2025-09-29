"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "vacancies",
      [
        {
          position: "Повар",
          location: "Москва, ул. Тверская, 15",
          salary: "от 50 000 руб.",
          description:
            "Ищем опытного повара для работы в нашем ресторане. Требования: опыт работы от 2 лет, знание итальянской кухни.",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          position: "Официант",
          location: "Москва, ул. Арбат, 25",
          salary: "от 40 000 руб. + чаевые",
          description:
            "Требуется официант с опытом работы в ресторане. Приветливое отношение к гостям, знание меню.",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          position: "Курьер",
          location: "Москва, все районы",
          salary: "от 35 000 руб. + бонусы",
          description:
            "Доставка заказов по городу. Требуется водительское удостоверение категории B.",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          position: "Менеджер ресторана",
          location: "Москва, ул. Красная Площадь, 1",
          salary: "от 70 000 руб.",
          description:
            "Управление персоналом, контроль качества обслуживания, работа с поставщиками.",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          position: "Бармен",
          location: "Москва, ул. Кузнецкий мост, 10",
          salary: "от 45 000 руб. + чаевые",
          description:
            "Приготовление коктейлей, обслуживание гостей за барной стойкой.",
          is_active: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vacancies", null, {});
  },
};
