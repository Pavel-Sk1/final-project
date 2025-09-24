"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "news",
      [
        {
          id: 1,
          title: "Новое меню в нашем ресторане!",
          discription:
            "Мы рады представить вам обновленное меню с новыми блюдами и вкусами",
          img: "/images/news/new-menu.jpg",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: "Скидка 20% на все пиццы",
          discription: "Только в выходные дни скидка 20% на все виды пиццы",
          img: "/images/news/pizza-discount.jpg",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          title: "Доставка теперь работает круглосуточно",
          discription:
            "Мы расширили часы работы доставки - теперь заказать еду можно в любое время",
          img: "/images/news/24h-delivery.jpg",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          title: "Новый филиал открылся в центре города",
          discription:
            "Приглашаем посетить наш новый ресторан в самом сердце города",
          img: "/images/news/new-branch.jpg",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          title: "Специальное предложение для студентов",
          discription:
            "Студентам скидка 15% при предъявлении студенческого билета",
          img: "/images/news/student-discount.jpg",
          is_active: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("news", null, {});
  },
};
