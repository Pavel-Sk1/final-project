"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Products",
      [
        {

          name: "Ватрушка",
          img: "https://images.unsplash.com/photo-1548365328-9f547fb09530",
          price: 24,
          recipe: "Томатный соус, моцарелла, базилик, оливковое масло",
          category_id: 1,
          is_active: true,
          weight: 90,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          name: "Пирог с яйцом жар/печ",
          img: "https://images.unsplash.com/photo-1600628422015-7430f3e7173b",
          price: 25,
          recipe: "Томатный соус, моцарелла, пепперони, орегано",
          category_id: 1,
          is_active: true,
          weight: 75,

          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          name: "Пирог с картошкой жар/печ",
          img: "https://images.unsplash.com/photo-1601924638867-3ec6b1c9b8e0",
          price: 20,
          recipe: "Моцарелла, горгонзола, пармезан, рикотта",
          category_id: 1,
          is_active: true,
          weight: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Бургеры
        {

          name: "Пирог с капустой жар/печ",
          img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
          price: 20,
          recipe: "Говяжья котлета, салат, помидор, лук, соус",
          category_id: 2,
          is_active: true,
          weight: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          name: "Пирог с повидло жар/печ",
          img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
          price: 20,
          recipe: "Говяжья котлета, сыр чеддер, салат, помидор, лук",
          category_id: 2,
          is_active: true,
          weight: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Напитки
        {

          name: "Пирог с творогом жар/печ",
          img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
          price: 23,
          recipe: "Газированный напиток",
          category_id: 3,
          is_active: true,
          weight: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          name: "Пирог с печенкой жар/печ",
          img: "https://images.unsplash.com/photo-1571076730260-35a1f7c5d5cd",
          price: 25,
          recipe: "Свежевыжатый апельсиновый сок",
          category_id: 3,
          is_active: true,
          weight: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Десерты
        {

          name: "Пирог с зеленым луком и яйцом жар/печ",
          img: "https://images.unsplash.com/photo-1612197527762-8cfb55a3a7f3",
          price: 25,
          recipe: "Кофейный десерт с маскарпоне и савоярди",
          category_id: 4,
          is_active: true,
          weight: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          name: "Пирог с яблоком",
          img: "https://images.unsplash.com/photo-1551024709-8f23befc6cf7",
          price: 20,
          recipe: "Классический чизкейк с ягодным соусом",
          category_id: 4,
          is_active: true,
          weight: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Салаты
        {

          name: "Пирог с мясом",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 35,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          name: "Беляш",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 35,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 80,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Пицца",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 32,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 130,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Сосиска в тесте",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 34,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 70,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Плюшка с маком",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 23,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 145,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: 'Пирог "Славянский"',
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 45,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 145,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Пирог пресный с яйцом",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 40,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 145,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
            
          name: "Пирог пресный с картошкой",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 40,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 145,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Пирог пресный с капустой",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 40,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 145,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Пирог пресный с яблоками",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 40,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          weight: 145,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Пирог пресный с творогом",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 40,
          weight: 145,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Пирог пресный с зеленым луком и яйцом",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 40,
          weight: 145,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Пирог пресный с курагой",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 40,
          weight: 145,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            
          name: "Хот-дог",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 40,
          weight: 145,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {

          name: "Провансалька",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 50,
          weight: 140,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
                
          name: "Пирог с курицей",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 55,
          weight: 130,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
                
          name: "Булка городская",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 20,
          weight: 200,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
                
          name: "Тесто дрожевое",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 45,
          weight: 500,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
                
          name: "Сырники",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 30,
          weight: 60,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
                
          name: "Запеканка творожная",
          img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
          price: 400,
          weight: 1000,
          recipe: "Салат романо, курица, пармезан, сухарики, соус цезарь",
          category_id: 5,
          is_active: true,
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
