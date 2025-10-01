"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "information",
      [
        {
          title: "О нас",
          description:
            "Мы - семейный ресторан с многолетней историей, специализирующийся на итальянской кухне. Наша миссия - дарить гостям незабываемые вкусовые впечатления.",
          img: "/images/about-us.jpg",
          page: "about",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Наша история",
          description:
            "Ресторан был основан в 1995 году итальянским шеф-поваром Марио Росси. С тех пор мы сохраняем традиции аутентичной итальянской кухни.",
          img: "/images/our-history.jpg",
          page: "history",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Контакты",
          description:
            "Мы всегда рады видеть вас в нашем ресторане. Свяжитесь с нами для бронирования столика или заказа доставки.",
          img: "/images/contacts.jpg",
          page: "contacts",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Доставка",
          description:
            "Быстрая доставка по всему городу в течение 30-45 минут. Минимальная сумма заказа - 500 рублей.",
          img: "/images/delivery.jpg",
          page: "delivery",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Акции и скидки",
          description:
            "Следите за нашими акциями и специальными предложениями. Регулярные скидки для постоянных клиентов.",
          img: "/images/promotions.jpg",
          page: "promotions",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("information", null, {});
  },
};
