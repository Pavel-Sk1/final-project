const { Telegraf } = require("telegraf");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const BotController = require("./src/controllers/botController");

// Получаем токен из переменных окружения или используем дефолтный
const BOT_TOKEN =
  process.env.BOT_TOKEN || "7926508287:AAGw_xxoIA8okKGL6OoleyY8Hw_vyKoGpSs";

const bot = new Telegraf(BOT_TOKEN);

// Создаем контроллер и регистрируем команды
const botController = new BotController(bot);
botController.registerCommands();

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error("Bot error:", err);
  ctx.reply("Произошла ошибка. Попробуйте позже.");
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

bot.launch();
console.log("🤖 Telegram бот поставщика запущен!");
console.log(
  '📱 Бот готов принимать заказы от магазинов в формате: "название товара - количество"'
);
