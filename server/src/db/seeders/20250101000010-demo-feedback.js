"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "feedback",
      [
        {
          user_name: "Анна Петрова",
          user_contact: "anna.petrova@email.com",
          message:
            "Отличный ресторан! Пицца была просто восхитительной, а обслуживание на высшем уровне. Обязательно вернемся снова!",
          subject: "Благодарность за отличный сервис",
          status: "processed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_name: "Михаил Иванов",
          user_contact: "+7 (999) 123-45-67",
          message:
            "Заказывал доставку на дом. Еда приехала быстро и была еще горячей. Очень доволен качеством!",
          subject: "Доставка",
          status: "processed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_name: "Елена Смирнова",
          user_contact: "elena.smirnova@email.com",
          message:
            "Хотелось бы видеть больше вегетарианских опций в меню. В остальном все отлично!",
          subject: "Предложение по меню",
          status: "in_progress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_name: "Дмитрий Козлов",
          user_contact: "+7 (999) 234-56-78",
          message:
            "Была проблема с заказом - привезли не то блюдо. Но персонал быстро все исправил. Спасибо за понимание!",
          subject: "Проблема с заказом",
          status: "resolved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_name: "Ольга Васильева",
          user_contact: "olga.vasilieva@email.com",
          message:
            "Ресторан очень уютный, атмосфера приятная. Еда вкусная, но цены немного высокие.",
          subject: "Отзыв о ресторане",
          status: "new",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_name: "Алексей Морозов",
          user_contact: "+7 (999) 345-67-89",
          message:
            "Отличное место для семейного ужина! Детям очень понравилось, а взрослые остались довольны качеством блюд.",
          subject: "Семейный ужин",
          status: "processed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_name: "Татьяна Новикова",
          user_contact: "tatiana.novikova@email.com",
          message:
            "Хотелось бы узнать о возможности проведения корпоративного мероприятия в вашем ресторане.",
          subject: "Корпоративное мероприятие",
          status: "new",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("feedback", null, {});
  },
};
