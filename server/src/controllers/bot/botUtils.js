const { Markup } = require("telegraf");

class BotUtils {
  /**
   * Создание клавиатуры с товарами
   */
  static createProductKeyboard(products, userId, userStates) {
    console.log("Creating product keyboard for user:", userId);
    console.log("Products count:", products.length);

    const userState = userStates.get(userId);
    if (!userState) {
      console.log("User state not found for user:", userId);
      return Markup.inlineKeyboard([
        [Markup.button.callback("Ошибка: сессия истекла", "error")],
      ]);
    }

    const currentPage = userState.currentPage || 0;
    const productsPerPage = userState.productsPerPage || 5;

    // Получаем товары для текущей страницы
    const startIndex = currentPage * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = products.slice(startIndex, endIndex);

    const buttons = [];

    // Добавляем товары
    pageProducts.forEach((product) => {
      const cartItem = userState.cart.find(
        (item) => item.productId === product.id
      );

      // Кнопка с названием товара и ценой
      let productText = `${product.name} - ${product.price}₽`;
      if (product.variants && product.variant_names) {
        const variantText = product.variants
          .map((v, i) => `${v}(${product.variant_names[i]})`)
          .join("/");
        productText += ` [${variantText}]`;
      }

      buttons.push([
        Markup.button.callback(productText, `product_${product.id}`),
      ]);

      // Кнопка с количеством
      let quantityText = "Количество: ";
      if (cartItem) {
        if (cartItem.variantQuantities) {
          // Показываем варианты
          const variantText = Object.entries(cartItem.variantQuantities)
            .map(([variant, qty]) => `${variant}:${qty}`)
            .join("/");
          quantityText += variantText;
        } else {
          // Обычное количество
          quantityText += cartItem.quantity || 0;
        }
      } else {
        quantityText += "0";
      }

      buttons.push([
        Markup.button.callback(quantityText, `quantity_${product.id}`),
      ]);
    });

    // Добавляем навигацию
    const totalPages = Math.ceil(products.length / productsPerPage);
    console.log(
      `Creating keyboard: currentPage=${currentPage}, totalPages=${totalPages}, productsPerPage=${productsPerPage}`
    );

    if (totalPages > 1) {
      const navButtons = [];
      if (currentPage > 0) {
        navButtons.push(
          Markup.button.callback("⬅️ Назад", `page_${currentPage - 1}`)
        );
      }
      if (currentPage < totalPages - 1) {
        navButtons.push(
          Markup.button.callback("Вперед ➡️", `page_${currentPage + 1}`)
        );
      }
      if (navButtons.length > 0) {
        buttons.push(navButtons);
        console.log(`Navigation buttons added: ${navButtons.length} buttons`);
      }
    }

    // Добавляем кнопки корзины
    const cartButtons = [];
    if (userState.cart && userState.cart.length > 0) {
      cartButtons.push(
        Markup.button.callback("🛒 Корзина", "view_cart"),
        Markup.button.callback("✅ Заказать", "confirm_order")
      );
    }
    cartButtons.push(Markup.button.callback("🗑️ Очистить", "clear_cart"));
    buttons.push(cartButtons);

    console.log("Products found:", products.length);
    console.log("Keyboard created: Yes");

    return Markup.inlineKeyboard(buttons);
  }

  /**
   * Получение эмодзи статуса
   */
  static getStatusEmoji(status) {
    const statusEmojis = {
      pending: "⏳",
      in_progress: "📦",
      completed: "✅",
      cancelled: "❌",
      delivered: "🚚",
    };
    return statusEmojis[status] || "❓";
  }

  /**
   * Получение текста статуса
   */
  static getStatusText(status) {
    const statusTexts = {
      pending: "Ожидает подтверждения",
      in_progress: "В процессе приготовления",
      completed: "Готов к выдаче",
      cancelled: "Отменен",
      delivered: "Доставлен",
    };
    return statusTexts[status] || "Неизвестный статус";
  }

  /**
   * Создание постоянной клавиатуры
   */
  static createPersistentKeyboard() {
    return {
      reply_markup: {
        keyboard: [
          ["🛒 Заказать товары", "📋 Мои заказы"],
          ["📊 Статистика", "❓ Помощь"],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    };
  }
}

module.exports = BotUtils;
