# База данных проекта

## Описание

База данных содержит 12 таблиц для управления ресторанным бизнесом:

### Основные таблицы:

- **roles** - роли пользователей (admin, manager, user, moderator)
- **Users** - пользователи системы с ролями
- **categories** - категории продуктов
- **Products** - продукты/блюда ресторана
- **news** - новости и акции
- **vacancies** - вакансии
- **information** - информационные страницы
- **partner** - партнеры и поставщики
- **contacts** - контактная информация
- **feedback** - отзывы и обратная связь
- **tg_users** - пользователи Telegram бота
- **tg_orders** - заказы через Telegram

## Схема связей

```
roles (1) -----> (many) Users
categories (1) -----> (many) Products
tg_users (1) -----> (many) tg_orders
Products (1) -----> (many) tg_orders
```

## Команды для работы с БД

### Создание и миграция базы данных:

```bash
npm run db
```

### Заполнение тестовыми данными:

```bash
npm run db:seed
```

### Полный сброс с тестовыми данными:

```bash
npm run db:reset
```

## Тестовые данные

### Пользователи:

- **admin** / admin123! (роль: admin)
- **manager1** / admin123! (роль: manager)
- **user1** / admin123! (роль: user)
- **moderator1** / admin123! (роль: moderator)

### Категории продуктов:

- Пицца
- Бургеры
- Напитки
- Десерты
- Салаты

### Продукты:

- Маргарита (450 руб.)
- Пепперони (550 руб.)
- Четыре сыра (600 руб.)
- Классический бургер (350 руб.)
- Чизбургер (380 руб.)
- Кока-Кола (120 руб.)
- Апельсиновый сок (150 руб.)
- Тирамису (280 руб.)
- Чизкейк (320 руб.)
- Цезарь (250 руб.)

### Telegram пользователи:

- 8 тестовых пользователей с заказами
- 12 тестовых заказов с различными статусами

## Структура файлов

```
src/db/
├── config/
│   └── database.json          # Конфигурация БД
├── migrations/                # Миграции
│   ├── 20250101000001-create-roles.js
│   ├── 20250101000002-create-news.js
│   ├── ...
│   └── 20250101000012-create-user.js
├── models/                    # Модели Sequelize
│   ├── role.js
│   ├── user.js
│   ├── category.js
│   ├── product.js
│   ├── news.js
│   ├── vacancy.js
│   ├── information.js
│   ├── partner.js
│   ├── contact.js
│   ├── feedback.js
│   ├── tgUser.js
│   ├── tgOrder.js
│   └── index.js
└── seeders/                   # Тестовые данные
    ├── 20250101000001-demo-roles.js
    ├── 20250101000002-demo-users.js
    ├── ...
    └── 20250101000012-demo-tg-orders.js
```

## Использование в коде

```javascript
const db = require("./src/db/models");

// Получить все продукты с категориями
const products = await db.Product.findAll({
  include: [
    {
      model: db.Category,
      as: "category",
    },
  ],
});

// Получить пользователя с ролью
const user = await db.User.findByPk(1, {
  include: [
    {
      model: db.Role,
      as: "role",
    },
  ],
});

// Получить заказы Telegram пользователя
const orders = await db.TgOrder.findAll({
  where: { tg_user_id: 1 },
  include: [
    { model: db.TgUser, as: "tgUser" },
    { model: db.Product, as: "product" },
  ],
});
```
