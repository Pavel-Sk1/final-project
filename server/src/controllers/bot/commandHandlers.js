// const { Markup } = require("telegraf"); // Не используется в этом файле

class CommandHandlers {
  constructor(botController) {
    this.botController = botController;
  }

  /**
   * Обработчик команды /start
   */
  async handleStart(ctx) {
    const welcomeMessage = `
🏪 Добро пожаловать в систему заказов поставщика!

Я помогу вам сделать заказ товаров для вашего магазина. Вот что я умею:

📋 /catalog - Посмотреть каталог товаров
🛒 /order - Сделать заказ через меню
📊 /myorders - Мои заказы
📈 /stats - Статистика заказов
❓ /help - Помощь

Для быстрого заказа используйте кнопку "🛒 Заказать товары" ниже!
    `;

    const keyboard = {
      reply_markup: {
        keyboard: [
          ["🛒 Заказать товары", "📋 Мои заказы"],
          ["📊 Статистика", "❓ Помощь"],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    };

    await ctx.reply(welcomeMessage, keyboard);
  }

  /**
   * Обработчик команды /help
   */
  async handleHelp(ctx) {
    const helpMessage = `
📖 Справка по командам:

/start - Начать работу с ботом
/catalog - Посмотреть каталог товаров поставщика
/order - Сделать заказ через удобное меню
/myorders - Посмотреть мои заказы
/stats - Статистика моих заказов
/help - Эта справка

🛒 Как сделать заказ:
1. Нажмите /order
2. Выберите товары и количество в меню
3. Подтвердите заказ

💡 Совет: Используйте команду /order для удобного выбора товаров!
    `;

    await ctx.reply(helpMessage);
  }

  /**
   * Обработчик команды /catalog
   */
  async handleCatalog(ctx) {
    try {
      const categories =
        await this.botController.orderService.getCategoriesWithProducts();

      if (categories.length === 0) {
        await ctx.reply("Каталог пока пустой 😔");
        return;
      }

      let catalogText = "📦 *Каталог товаров поставщика:*\n\n";

      for (const category of categories) {
        catalogText += `📂 *${category.name}*\n`;
        if (category.description) {
          catalogText += `${category.description}\n`;
        }

        for (const product of category.Products) {
          catalogText += `• ${product.name} - ${product.price}₽\n`;
        }
        catalogText += "\n";
      }

      await ctx.reply(catalogText, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("Catalog error:", error);
      await ctx.reply("Произошла ошибка при загрузке каталога");
    }
  }

  /**
   * Обработчик команды /order
   */
  async handleOrder(ctx) {
    await this.botController.handleOrderCommand(ctx);
  }

  /**
   * Обработчик команды /myorders
   */
  async handleMyOrders(ctx) {
    await this.botController.handleMyOrdersCommand(ctx);
  }

  /**
   * Обработчик команды /stats
   */
  async handleStats(ctx) {
    await this.botController.handleStatsCommand(ctx);
  }
}

module.exports = CommandHandlers;
