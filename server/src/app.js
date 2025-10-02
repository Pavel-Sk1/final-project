const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const express = require("express");
const serverConfig = require("./config/serverConfig");
const apiRoutes = require("./routes/api.routes");

const { PORT } = process.env || 3000;

const app = express();

serverConfig(app); //! конфигурация

app.use("/api", apiRoutes);
// Статическая раздача загруженных файлов
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Запуск Telegram бота
try {
  const { Telegraf } = require("telegraf");
  const BotController = require("./controllers/botController");

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
  console.log("📱 Бот готов принимать заказы от магазинов");

  // Сохраняем экземпляр бота в глобальном контексте для использования в других модулях
  global.telegramBot = bot;
} catch (error) {
  console.error("Ошибка запуска Telegram бота:", error);
  console.log("Сервер будет работать без бота");
}
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
