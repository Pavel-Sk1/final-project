const { Markup } = require("telegraf");
const OrderService = require("../services/orderServices");
const { TgUser, Product, Category } = require("../db/models");

class BotController {
  constructor(bot) {
    this.bot = bot;
    this.userStates = new Map();
  }

  registerCommands() {
    // Команда /start
    this.bot.start(async (ctx) => {
      const welcomeMessage = `
🏪 Добро пожаловать в систему заказов поставщика!

Я помогу вам сделать заказ товаров для вашего магазина. Вот что я умею:

📋 /catalog - Посмотреть каталог товаров
🛒 /order - Сделать заказ
📊 /myorders - Мои заказы
📈 /stats - Статистика заказов
❓ /help - Помощь

Для заказа просто напишите в формате:
"название товара - количество"

Например:
хлеб белый - 20
молоко 3.2% - 15
сыр российский - 5
      `;

      await ctx.reply(welcomeMessage);
    });

    // Команда /help
    this.bot.help(async (ctx) => {
      const helpMessage = `
📖 Справка по командам:

/start - Начать работу с ботом
/catalog - Посмотреть каталог товаров поставщика
/order - Сделать заказ
/myorders - Посмотреть мои заказы
/stats - Статистика моих заказов
/help - Эта справка

📝 Формат заказа:
Просто напишите название товара и количество через дефис:

хлеб белый - 20
молоко 3.2% - 15
сыр российский - 5

Можно заказать несколько товаров в одном сообщении, каждое с новой строки.

💡 Совет: Используйте точные названия товаров из каталога для быстрого поиска.
      `;

      await ctx.reply(helpMessage);
    });

    // Команда /catalog (вместо /menu)
    this.bot.command("catalog", async (ctx) => {
      try {
        const categories = await OrderService.getCategoriesWithProducts();

        if (categories.length === 0) {
          await ctx.reply("Каталог пока пустой 😔");
          return;
        }

        let catalogText = "📦 *Каталог товаров поставщика:*\n\n";

        for (const category of categories) {
          catalogText += `📂 *${category.name}*\n`;
          if (category.description) {
            catalogText += `_${category.description}_\n`;
          }

          if (category.products && category.products.length > 0) {
            for (const product of category.products) {
              catalogText += `• ${product.name} - ${product.price} руб./шт.\n`;
              if (product.recipe) {
                catalogText += `  _${product.recipe}_\n`;
              }
            }
          } else {
            catalogText += "  _Пока нет товаров_\n";
          }
          catalogText += "\n";
        }

        await ctx.reply(catalogText, { parse_mode: "Markdown" });
      } catch (error) {
        await ctx.reply("Ошибка при загрузке каталога. Попробуйте позже.");
        console.error("Catalog error:", error);
      }
    });

    // Команда /order
    this.bot.command("order", async (ctx) => {
      const orderMessage = `
🛒 *Как сделать заказ поставщику:*

Просто напишите название товара и количество через дефис:

*Примеры:*
• хлеб белый - 20
• молоко 3.2% - 15  
• сыр российский - 5

*Можно заказать несколько товаров:*
хлеб белый - 20
молоко 3.2% - 15
сыр российский - 5

После отправки заказа я подтвержу его и передам поставщику! 📦
      `;

      await ctx.reply(orderMessage, { parse_mode: "Markdown" });
    });

    // Команда /myorders
    this.bot.command("myorders", async (ctx) => {
      try {
        const telegramId = ctx.from.id;
        const orders = await OrderService.getUserOrders(telegramId);

        if (orders.length === 0) {
          await ctx.reply("У вас пока нет заказов. Сделайте первый заказ! 🛒");
          return;
        }

        let ordersText = "📋 *Ваши заказы поставщику:*\n\n";

        for (const order of orders) {
          const statusEmoji = this.getStatusEmoji(order.status);
          ordersText += `${statusEmoji} *${order.product.name}*\n`;
          ordersText += `Количество: ${order.quantity} шт.\n`;
          ordersText += `Цена: ${order.product.price * order.quantity} руб.\n`;
          ordersText += `Статус: ${this.getStatusText(order.status)}\n`;
          ordersText += `Дата: ${order.createdAt.toLocaleDateString(
            "ru-RU"
          )}\n`;
          if (order.user_comment) {
            ordersText += `Комментарий: ${order.user_comment}\n`;
          }
          ordersText += "\n";
        }

        await ctx.reply(ordersText, { parse_mode: "Markdown" });
      } catch (error) {
        await ctx.reply("Ошибка при загрузке заказов. Попробуйте позже.");
        console.error("Orders error:", error);
      }
    });

    // Команда /stats
    this.bot.command("stats", async (ctx) => {
      try {
        const telegramId = ctx.from.id;
        const stats = await OrderService.getUserOrderStats(telegramId);

        if (!stats) {
          await ctx.reply("У вас пока нет заказов. Сделайте первый заказ! 🛒");
          return;
        }

        const statsText = `
📊 *Статистика ваших заказов:*

📦 Всего заказов: ${stats.totalOrders}
💰 Общая сумма: ${stats.totalAmount} руб.

📈 *По статусам:*
${Object.entries(stats.statusCounts)
  .map(
    ([status, count]) =>
      `${this.getStatusEmoji(status)} ${this.getStatusText(status)}: ${count}`
  )
  .join("\n")}

${
  stats.lastOrder
    ? `\n🕒 Последний заказ: ${stats.lastOrder.createdAt.toLocaleDateString(
        "ru-RU"
      )}`
    : ""
}
        `;

        await ctx.reply(statsText, { parse_mode: "Markdown" });
      } catch (error) {
        await ctx.reply("Ошибка при загрузке статистики. Попробуйте позже.");
        console.error("Stats error:", error);
      }
    });

    // Обработка текстовых сообщений (заказы)
    this.bot.on("text", async (ctx) => {
      const message = ctx.message.text;

      // Пропускаем команды
      if (message.startsWith("/")) {
        return;
      }

      try {
        const telegramId = ctx.from.id;
        const userInfo = {
          username: ctx.from.username,
          first_name: ctx.from.first_name,
          last_name: ctx.from.last_name,
        };

        // Парсим заказ
        const orderItems = OrderService.parseOrderText(message);

        if (orderItems.length === 0) {
          await ctx.reply(`
❌ Не удалось распознать заказ.

Используйте формат:
"название товара - количество"

Например: хлеб белый - 20

Для помощи напишите /help
          `);
          return;
        }

        // Создаем заказы
        const results = await OrderService.createOrdersFromText(
          telegramId,
          message,
          userInfo
        );

        let responseText = "🛒 *Ваш заказ поставщику принят!*\n\n";
        let totalAmount = 0;
        let successCount = 0;
        let errorCount = 0;

        for (const result of results) {
          if (result.success) {
            successCount++;
            totalAmount += result.totalPrice;
            responseText += `✅ ${result.product.name} - ${result.quantity} шт. (${result.totalPrice} руб.)\n`;
          } else {
            errorCount++;
            responseText += `❌ ${result.productName} - ${result.error}\n`;
          }
        }

        responseText += `\n💰 *Итого: ${totalAmount} руб.*\n`;
        responseText += `📦 Товаров: ${successCount}\n`;

        if (errorCount > 0) {
          responseText += `⚠️ Ошибок: ${errorCount}\n`;
        }

        responseText +=
          "\n🕒 Заказ передан поставщику. Ожидайте подтверждения!";

        await ctx.reply(responseText, { parse_mode: "Markdown" });
      } catch (error) {
        await ctx.reply(
          "Произошла ошибка при обработке заказа. Попробуйте позже."
        );
        console.error("Order processing error:", error);
      }
    });
  }

  getStatusEmoji(status) {
    const statusEmojis = {
      pending: "⏳",
      in_progress: "📦",
      completed: "✅",
      cancelled: "❌",
      delivered: "🚚",
    };
    return statusEmojis[status] || "❓";
  }

  getStatusText(status) {
    const statusTexts = {
      pending: "Ожидает обработки",
      in_progress: "В обработке",
      completed: "Готов к отгрузке",
      cancelled: "Отменен",
      delivered: "Доставлен",
    };
    return statusTexts[status] || status;
  }
}

module.exports = BotController;
