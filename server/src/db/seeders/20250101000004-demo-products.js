"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      [
        // Пицца
        {
          id: 1,
          name: "Маргарита",
          img: "/images/pizza-margherita.jpg",
          price: 450,
          recipe: "Томатный соус, моцарелла, базилик, оливковое масло",
          category_id: 1,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Пепперони",
          img: "/images/pizza-pepperoni.jpg",
          price: 550,
          recipe: "Томатный соус, моцарелла, пепперони, орегано",
          category_id: 1,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Четыре сыра",
          img: "/images/pizza-four-cheese.jpg",
          price: 600,
          recipe: "Моцарелла, горгонзола, пармезан, рикотта",
          category_id: 1,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Бургеры
        {
          id: 4,
          name: "Классический бургер",
          img: "/images/burger-classic.jpg",
          price: 350,
          recipe: "Говяжья котлета, салат, помидор, лук, соус",
          category_id: 2,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: "Чизбургер",
          img: "/images/burger-cheese.jpg",
          price: 380,
          recipe: "Говяжья котлета, сыр чеддер, салат, помидор, лук",
          category_id: 2,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Напитки
        {
          id: 6,
          name: "Кока-Кола",
          img: "/images/coca-cola.jpg",
          price: 120,
          recipe: "Газированный напиток",
          category_id: 3,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "Апельсиновый сок",
          img: "/images/orange-juice.jpg",
          price: 150,
          recipe: "Свежевыжатый апельсиновый сок",
          category_id: 3,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Десерты
        {
          id: 8,
          name: "Тирамису",
          img: "/images/tiramisu.jpg",
          price: 280,
          recipe: "Кофейный десерт с маскарпоне и савоярди",
          category_id: 4,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: "Чизкейк",
          img: "/images/cheesecake.jpg",
          price: 320,
          recipe: "Классический чизкейк с ягодным соусом",
          category_id: 4,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Салаты
        {
          id: 10,
          name: "Цезарь",
          img: "/images/caesar-salad.jpg",
          price: 250,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
