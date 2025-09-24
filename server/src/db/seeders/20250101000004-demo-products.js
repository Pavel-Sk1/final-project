"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Products",
      [
        // Пицца
        {
          id: 1,
          name: "Маргарита",
          img: "https://images.unsplash.com/photo-1548365328-9f547fb09530",
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
          img: "https://images.unsplash.com/photo-1600628422015-7430f3e7173b",
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
          img: "https://images.unsplash.com/photo-1601924638867-3ec6b1c9b8e0",
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
          img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
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
          img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
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
          img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
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
          img: "https://images.unsplash.com/photo-1571076730260-35a1f7c5d5cd",
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
          img: "https://images.unsplash.com/photo-1612197527762-8cfb55a3a7f3",
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
          img: "https://images.unsplash.com/photo-1551024709-8f23befc6cf7",
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
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
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

  async down(queryInterface) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
