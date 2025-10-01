"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "news",
      [
        {
          title: "Новое меню в нашем ресторане!",
          description:
            "Мы рады представить вам обновленное меню с новыми блюдами и вкусами",
          img: "/images/news/new-menu.jpg",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Скидка 20% на все пиццы",
          description: "Только в выходные дни скидка 20% на все виды пиццы",
          img: "/images/news/pizza-discount.jpg",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Доставка теперь работает круглосуточно",
          description:
            "Мы расширили часы работы доставки - теперь заказать еду можно в любое время",
          img: "/images/news/24h-delivery.jpg",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Новый филиал открылся в центре города",
          description:
            "Приглашаем посетить наш новый ресторан в самом сердце города",
          img: "/images/news/new-branch.jpg",
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Специальное предложение для студентов",
          description:
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
