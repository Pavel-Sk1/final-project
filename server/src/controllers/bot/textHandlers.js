const { Product } = require("../../db/models");

class TextHandlers {
  constructor(botController) {
    this.botController = botController;
  }

  /**
   * Обработчик текстовых сообщений
   */
  async handleText(ctx) {
    const userId = ctx.from.id;
    const userState = this.botController.userStates.get(userId);

    // Проверяем, не является ли это командой
    if (ctx.message.text.startsWith("/")) {
      return; // Пропускаем команды
    }

    // Проверяем, не является ли это кнопкой клавиатуры
    const keyboardButtons = [
      "🛒 Заказать товары",
      "📋 Мои заказы",
      "📊 Статистика",
      "❓ Помощь",
    ];
    if (keyboardButtons.includes(ctx.message.text)) {
      return; // Пропускаем кнопки клавиатуры
    }

    if (userState && userState.waitingForQuantity) {
      await this.handleQuantityInput(ctx, userState, userId);
    }
  }

  /**
   * Обработка ввода количества
   */
  async handleQuantityInput(ctx, userState, userId) {
    const productId = userState.waitingForQuantity;
    const inputText = ctx.message.text.trim();

    // Проверяем, есть ли варианты в тексте (например: "10/15")
    if (inputText.includes("/")) {
      await this.handleVariantQuantity(ctx, productId, inputText, userState);
    } else {
      await this.handleSimpleQuantity(ctx, productId, inputText, userState);
    }

    // Обновляем клавиатуру
    await this.updateProductKeyboard(ctx, userState, userId);
  }

  /**
   * Обработка количества с вариантами
   */
  async handleVariantQuantity(ctx, productId, inputText, userState) {
    // Парсим варианты
    const quantities = inputText.split("/").map((q) => parseInt(q.trim()));

    if (quantities.some((q) => isNaN(q) || q < 0 || q > 100)) {
      await ctx.reply(
        "Пожалуйста, введите числа от 0 до 100 через слеш (например: 10/15):"
      );
      return;
    }

    // Получаем информацию о продукте
    const product = await Product.findByPk(productId);
    if (!product || !product.variants) {
      await ctx.reply("Этот товар не поддерживает варианты");
      return;
    }

    // Создаем объект с количествами для каждого варианта
    const variantQuantities = {};
    for (let i = 0; i < product.variants.length && i < quantities.length; i++) {
      variantQuantities[product.variants[i]] = quantities[i];
    }

    // Добавляем в корзину с вариантами
    const existingItem = userState.cart.find(
      (item) => item.productId === productId
    );

    if (quantities.every((q) => q === 0)) {
      // Удаляем товар из корзины
      if (existingItem) {
        userState.cart = userState.cart.filter(
          (item) => item.productId !== productId
        );
      }
    } else {
      // Добавляем или обновляем товар с вариантами
      if (existingItem) {
        existingItem.variantQuantities = variantQuantities;
      } else {
        userState.cart.push({
          productId,
          variantQuantities: variantQuantities,
        });
      }
    }

    userState.waitingForQuantity = null;

    // Формируем сообщение о добавлении вариантов
    const variantText = Object.entries(variantQuantities)
      .map(([variant, qty]) => `${variant}: ${qty}`)
      .join(", ");

    await ctx.reply(`✅ Варианты добавлены: ${variantText}`);
  }

  /**
   * Обработка простого количества
   */
  async handleSimpleQuantity(ctx, productId, inputText, userState) {
    const quantity = parseInt(inputText);

    if (isNaN(quantity) || quantity < 0 || quantity > 100) {
      await ctx.reply(
        "Пожалуйста, введите число от 0 до 100 (0 для удаления):"
      );
      return;
    }

    // Добавляем или обновляем товар в корзине
    const existingItem = userState.cart.find(
      (item) => item.productId === productId
    );

    if (quantity === 0) {
      // Удаляем товар из корзины
      if (existingItem) {
        userState.cart = userState.cart.filter(
          (item) => item.productId !== productId
        );
      }
    } else {
      // Добавляем или обновляем товар
      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        userState.cart.push({ productId, quantity });
      }
    }

    userState.waitingForQuantity = null;

    if (quantity === 0) {
      await ctx.reply(`✅ Товар удален из корзины!`);
    } else {
      await ctx.reply(`✅ Количество обновлено: ${quantity} шт.`);
    }
  }

  /**
   * Обновление клавиатуры товаров
   */
  async updateProductKeyboard(ctx, userState, userId) {
    const products = await this.botController.getProducts();
    const keyboard = this.botController.createProductKeyboard(products, userId);

    // Удаляем старое сообщение если оно есть
    if (userState.messageId) {
      try {
        await ctx.telegram.deleteMessage(ctx.chat.id, userState.messageId);
        console.log(
          `Deleted old message ${userState.messageId} for user ${userId}`
        );
      } catch (error) {
        console.log(`Could not delete old message: ${error.message}`);
      }
    }

    // Отправляем новое сообщение с обновленной таблицей
    const message = await ctx.reply(
      "🛒 *Заказ товаров поставщику*\n\n" +
        "📋 *Таблица товаров:*\n" +
        "Нажмите на товар для ввода количества\n" +
        "Используйте кнопки навигации для просмотра всех товаров",
      {
        parse_mode: "Markdown",
        reply_markup: keyboard.reply_markup,
      }
    );

    // Обновляем ID сообщения для будущих обновлений
    userState.messageId = message.message_id;
    console.log(`Updated message ID for user ${userId}: ${message.message_id}`);
  }
}

module.exports = TextHandlers;
