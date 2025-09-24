"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tg_users",
      [
        {
          id: 1,
          tg_user_id: 123456789,
          tg_username: "anna_petrova",
          first_name: "Анна",
          last_name: "Петрова",
          phone: "+7 (999) 111-22-33",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          tg_user_id: 987654321,
          tg_username: "mikhail_ivanov",
          first_name: "Михаил",
          last_name: "Иванов",
          phone: "+7 (999) 222-33-44",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          tg_user_id: 456789123,
          tg_username: "elena_smirnova",
          first_name: "Елена",
          last_name: "Смирнова",
          phone: "+7 (999) 333-44-55",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          tg_user_id: 789123456,
          tg_username: "dmitry_kozlov",
          first_name: "Дмитрий",
          last_name: "Козлов",
          phone: "+7 (999) 444-55-66",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          tg_user_id: 321654987,
          tg_username: "olga_vasilieva",
          first_name: "Ольга",
          last_name: "Васильева",
          phone: "+7 (999) 555-66-77",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          tg_user_id: 654987321,
          tg_username: "alexey_morozov",
          first_name: "Алексей",
          last_name: "Морозов",
          phone: "+7 (999) 666-77-88",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          tg_user_id: 147258369,
          tg_username: "tatiana_novikova",
          first_name: "Татьяна",
          last_name: "Новикова",
          phone: "+7 (999) 777-88-99",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          tg_user_id: 369258147,
          tg_username: "sergey_volkov",
          first_name: "Сергей",
          last_name: "Волков",
          phone: "+7 (999) 888-99-00",
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
