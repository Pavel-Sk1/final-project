const { Markup } = require("telegraf");
const { Product } = require("../../db/models");

class ActionHandlers {
  constructor(botController) {
    this.botController = botController;
  }

  /**
   * Обработчик выбора товара
   */
  async handleProductSelection(ctx) {
    const productId = parseInt(ctx.match[1]);
    const userId = ctx.from.id;

    await ctx.answerCbQuery("Товар выбран");

    // Получаем информацию о товаре
    const product = await Product.findByPk(productId);

    let message = "Введите количество товара:";
    if (product && product.variants && product.variant_names) {
      const variantText = product.variants
        .map((v, i) => `${v}(${product.variant_names[i]})`)
        .join("/");
      message =
        `Введите количество для вариантов ${variantText}:\n` +
        `Например: 10/15 (для ${product.variants.join("/")})`;
    } else {
      message = "Введите количество товара:";
    }

    // Запрашиваем количество
    await ctx.reply(message, Markup.forceReply());

    // Сохраняем состояние ожидания ввода количества
    this.botController.userStates.get(userId).waitingForQuantity = productId;
  }

  /**
   * Обработчик изменения количества товара
   */
  async handleQuantityChange(ctx) {
    const productId = parseInt(ctx.match[1]);
    const userId = ctx.from.id;

    await ctx.answerCbQuery("Изменить количество");

    // Запрашиваем новое количество
    await ctx.reply(
      "Введите новое количество товара (0 для удаления):",
      Markup.forceReply()
    );

    // Сохраняем состояние ожидания ввода количества
    this.botController.userStates.get(userId).waitingForQuantity = productId;
  }

  /**
   * Обработчик навигации по страницам
   */
  async handlePageNavigation(ctx) {
    const page = parseInt(ctx.match[1]);
    const userId = ctx.from.id;

    console.log(`Navigation: User ${userId} wants to go to page ${page}`);

    const userState = this.botController.userStates.get(userId);
    if (!userState) {
      console.log("Navigation: User state not found for user", userId);
      await ctx.answerCbQuery("Сессия истекла. Начните заново с /order");
      return;
    }

    console.log(
      `Navigation: Current page was ${userState.currentPage}, changing to ${page}`
    );
    userState.currentPage = page;

    // Обновляем клавиатуру
    const products = await this.botController.getProducts();
    const keyboard = this.botController.createProductKeyboard(products, userId);

    await ctx.editMessageText(
      "🛒 *Заказ товаров поставщику*\n\n" +
        "📋 *Таблица товаров:*\n" +
        "Нажмите на товар для ввода количества\n" +
        "Используйте кнопки навигации для просмотра всех товаров",
      {
        parse_mode: "Markdown",
        reply_markup: keyboard.reply_markup,
      }
    );

    await ctx.answerCbQuery();
  }

  /**
   * Обработчик очистки корзины
   */
  async handleClearCart(ctx) {
    const userId = ctx.from.id;
    const userState = this.botController.userStates.get(userId);

    if (!userState) {
      await ctx.answerCbQuery("Сессия истекла. Начните заново с /order");
      return;
    }

    userState.cart = [];

    // Обновляем клавиатуру
    const products = await this.botController.getProducts();
    const keyboard = this.botController.createProductKeyboard(products, userId);

    await ctx.editMessageText(
      "🛒 *Заказ товаров поставщику*\n\n" +
        "📋 *Таблица товаров:*\n" +
        "Нажмите на товар для ввода количества\n" +
        "Используйте кнопки навигации для просмотра всех товаров\n\n" +
        "✅ *Корзина очищена!*",
      {
        parse_mode: "Markdown",
        reply_markup: keyboard.reply_markup,
      }
    );

    await ctx.answerCbQuery("Корзина очищена!");
  }

  /**
   * Обработчик подтверждения заказа
   */
  async handleConfirmOrder(ctx) {
    await this.botController.handleConfirmOrder(ctx);
  }

  /**
   * Обработчик просмотра корзины
   */
  async handleViewCart(ctx) {
    await this.botController.handleViewCart(ctx);
  }
}

module.exports = ActionHandlers;
