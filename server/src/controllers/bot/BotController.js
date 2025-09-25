const { Product, Category } = require("../../db/models");
const OrderService = require("../../services/orderServices");
const AuthMiddleware = require("./authMiddleware");
const CommandHandlers = require("./commandHandlers");
const AdminHandlers = require("./adminHandlers");
const ActionHandlers = require("./actionHandlers");
const AdminActionHandlers = require("./adminActionHandlers");
const TextHandlers = require("./textHandlers");
const BotUtils = require("./botUtils");
const NotificationService = require("../../services/notificationService");

class BotController {
  constructor(bot) {
    this.bot = bot;
    this.userStates = new Map();
    this.orderService = OrderService;

    // Инициализируем обработчики
    this.commandHandlers = new CommandHandlers(this);
    this.adminHandlers = new AdminHandlers(this);
    this.actionHandlers = new ActionHandlers(this);
    this.adminActionHandlers = new AdminActionHandlers(this);
    this.textHandlers = new TextHandlers(this);
  }

  /**
   * Регистрация всех команд и обработчиков
   */
  registerCommands() {
    // Middleware для проверки авторизации
    this.bot.use(AuthMiddleware.checkAuthorization);

    // Основные команды
    this.bot.start(this.commandHandlers.handleStart.bind(this.commandHandlers));
    this.bot.help(this.commandHandlers.handleHelp.bind(this.commandHandlers));
    this.bot.command(
      "catalog",
      this.commandHandlers.handleCatalog.bind(this.commandHandlers)
    );
    this.bot.command(
      "order",
      this.commandHandlers.handleOrder.bind(this.commandHandlers)
    );
    this.bot.command(
      "myorders",
      this.commandHandlers.handleMyOrders.bind(this.commandHandlers)
    );
    this.bot.command(
      "stats",
      this.commandHandlers.handleStats.bind(this.commandHandlers)
    );

    // Административные команды
    this.bot.command(
      "adduser",
      AuthMiddleware.checkAdminRights,
      this.adminHandlers.handleAddUser.bind(this.adminHandlers)
    );
    this.bot.command(
      "removeuser",
      AuthMiddleware.checkAdminRights,
      this.adminHandlers.handleRemoveUser.bind(this.adminHandlers)
    );
    this.bot.command(
      "listusers",
      AuthMiddleware.checkAdminRights,
      this.adminHandlers.handleListUsers.bind(this.adminHandlers)
    );

    // Обработчики действий (кнопки)
    this.bot.action(
      /^product_(\d+)$/,
      this.actionHandlers.handleProductSelection.bind(this.actionHandlers)
    );
    this.bot.action(
      /^quantity_(\d+)$/,
      this.actionHandlers.handleQuantityChange.bind(this.actionHandlers)
    );
    this.bot.action(
      /^page_(\d+)$/,
      this.actionHandlers.handlePageNavigation.bind(this.actionHandlers)
    );
    this.bot.action(
      "clear_cart",
      this.actionHandlers.handleClearCart.bind(this.actionHandlers)
    );
    this.bot.action(
      "confirm_order",
      this.actionHandlers.handleConfirmOrder.bind(this.actionHandlers)
    );
    this.bot.action(
      "view_cart",
      this.actionHandlers.handleViewCart.bind(this.actionHandlers)
    );

    // Обработчики админских действий
    this.bot.action(
      /^admin_confirm_(\d+)$/,
      this.adminActionHandlers.handleConfirmOrder.bind(this.adminActionHandlers)
    );
    this.bot.action(
      /^admin_reject_(\d+)$/,
      this.adminActionHandlers.handleRejectOrder.bind(this.adminActionHandlers)
    );
    this.bot.action(
      /^admin_contact_(\d+)$/,
      this.adminActionHandlers.handleContactCustomer.bind(
        this.adminActionHandlers
      )
    );

    // Обработчики кнопок клавиатуры (должны быть ПЕРЕД обработчиком текста)
    this.bot.hears(
      "🛒 Заказать товары",
      this.commandHandlers.handleOrder.bind(this.commandHandlers)
    );
    this.bot.hears(
      "📋 Мои заказы",
      this.commandHandlers.handleMyOrders.bind(this.commandHandlers)
    );
    this.bot.hears(
      "📊 Статистика",
      this.commandHandlers.handleStats.bind(this.commandHandlers)
    );
    this.bot.hears(
      "❓ Помощь",
      this.commandHandlers.handleHelp.bind(this.commandHandlers)
    );

    // Обработчики текстовых сообщений (должен быть ПОСЛЕ обработчиков кнопок)
    this.bot.on("text", this.textHandlers.handleText.bind(this.textHandlers));
  }

  /**
   * Получение списка товаров
   */
  async getProducts() {
    return await Product.findAll({
      include: [{ model: Category, as: "category" }],
      where: { is_active: 1 },
      order: [
        ["category_id", "ASC"],
        ["name", "ASC"],
      ],
    });
  }

  /**
   * Создание клавиатуры с товарами
   */
  createProductKeyboard(products, userId) {
    return BotUtils.createProductKeyboard(products, userId, this.userStates);
  }

  /**
   * Обработчик команды заказа
   */
  async handleOrderCommand(ctx) {
    const userId = ctx.from.id;

    // Инициализируем состояние пользователя
    if (!this.userStates.has(userId)) {
      this.userStates.set(userId, {
        cart: [],
        currentPage: 0,
        productsPerPage: 5,
        waitingForQuantity: null,
        messageId: null,
      });
    }

    const userState = this.userStates.get(userId);
    const products = await this.getProducts();
    const keyboard = this.createProductKeyboard(products, userId);

    console.log("Products found:", products.length);
    console.log("Keyboard created:", keyboard ? "Yes" : "No");

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

    userState.messageId = message.message_id;
  }

  /**
   * Обработчик просмотра корзины
   */
  async handleViewCart(ctx) {
    const userId = ctx.from.id;
    const userState = this.userStates.get(userId);

    if (!userState || !userState.cart || userState.cart.length === 0) {
      await ctx.reply("🛒 Ваша корзина пуста");
      await ctx.answerCbQuery();
      return;
    }

    let cartText = "🛒 *Ваша корзина:*\n\n";
    let totalPrice = 0;

    for (const item of userState.cart) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        if (item.variantQuantities) {
          // Товар с вариантами
          cartText += `• ${product.name}\n`;
          let itemTotalPrice = 0;
          let totalQuantity = 0;

          for (const [variant, quantity] of Object.entries(
            item.variantQuantities
          )) {
            if (quantity > 0) {
              const variantPrice = product.price * quantity;
              itemTotalPrice += variantPrice;
              totalQuantity += quantity;

              // Находим название варианта
              const variantIndex = product.variants
                ? product.variants.indexOf(variant)
                : -1;
              const variantName =
                variantIndex >= 0 && product.variant_names
                  ? product.variant_names[variantIndex]
                  : variant;

              cartText += `  ${variantName}: ${quantity} шт. × ${product.price}₽ = ${variantPrice}₽\n`;
            }
          }

          cartText += `  Итого: ${totalQuantity} шт. = ${itemTotalPrice}₽\n\n`;
          totalPrice += itemTotalPrice;
        } else {
          // Обычный товар
          const itemPrice = product.price * item.quantity;
          totalPrice += itemPrice;
          cartText += `• ${product.name}\n`;
          cartText += `  Количество: ${item.quantity} шт.\n`;
          cartText += `  Цена: ${product.price}₽ × ${item.quantity} = ${itemPrice}₽\n\n`;
        }
      }
    }

    cartText += `💰 *Итого: ${totalPrice}₽*`;

    await ctx.reply(cartText, { parse_mode: "Markdown" });
    await ctx.answerCbQuery();
  }

  /**
   * Обработчик подтверждения заказа
   */
  async handleConfirmOrder(ctx) {
    const userId = ctx.from.id;
    const userState = this.userStates.get(userId);

    if (!userState || !userState.cart || userState.cart.length === 0) {
      await ctx.answerCbQuery("Корзина пуста. Добавьте товары!");
      return;
    }

    try {
      const userInfo = {
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
      };

      // Создаем заказы
      const results = [];
      let totalAmount = 0;
      let successCount = 0;
      let errorCount = 0;

      for (const item of userState.cart) {
        const productId = item.productId;
        try {
          let result;

          if (item.variantQuantities) {
            // Товар с вариантами
            result = await OrderService.createOrderWithVariants(
              userId,
              productId,
              item.variantQuantities,
              null,
              userInfo
            );
          } else {
            // Обычный товар
            result = await OrderService.createOrder(
              userId,
              productId,
              item.quantity,
              null,
              userInfo
            );
          }

          if (result.success) {
            successCount++;
            totalAmount += result.totalPrice;

            console.log(`📦 Order result:`, {
              success: result.success,
              orderId: result.orderId,
              product: result.product?.name,
              quantity: result.quantity,
            });

            if (item.variantQuantities) {
              // Для товаров с вариантами добавляем все результаты
              results.push(...result.results);
            } else {
              results.push({
                success: true,
                product: result.product,
                quantity: result.quantity,
                totalPrice: result.totalPrice,
                orderId: result.orderId,
              });
            }
          } else {
            errorCount++;
            results.push({
              success: false,
              productName: result.productName,
              error: result.error,
            });
          }
        } catch (error) {
          errorCount++;
          results.push({
            success: false,
            productName: `ID: ${productId}`,
            error: error.message,
          });
        }
      }

      // Формируем ответ
      let responseText = "🛒 *Ваш заказ поставщику принят!*\n\n";

      for (const result of results) {
        if (result.success) {
          if (result.variant) {
            // Товар с вариантом
            const variantIndex = result.product.variants
              ? result.product.variants.indexOf(result.variant)
              : -1;
            const variantName =
              variantIndex >= 0 && result.product.variant_names
                ? result.product.variant_names[variantIndex]
                : result.variant;
            responseText += `✅ ${result.product.name} (${variantName}) - ${result.quantity} шт. (${result.totalPrice} руб.)\n`;
          } else {
            // Обычный товар
            responseText += `✅ ${result.product.name} - ${result.quantity} шт. (${result.totalPrice} руб.)\n`;
          }
        } else {
          responseText += `❌ ${result.productName} - ${result.error}\n`;
        }
      }

      responseText += `\n💰 *Итого: ${totalAmount} руб.*\n`;
      responseText += `📦 Товаров: ${successCount}\n`;

      if (errorCount > 0) {
        responseText += `⚠️ Ошибок: ${errorCount}\n`;
      }

      responseText += "\n🕒 Заказ передан поставщику. Ожидайте подтверждения!";

      // Отправляем уведомления админам о новых заказах
      if (successCount > 0) {
        console.log(
          `📤 Sending notifications for ${successCount} successful orders`
        );
        try {
          const adminIds = await NotificationService.getAdminTelegramIds();
          console.log(`📋 Processing ${results.length} order results`);

          for (const result of results) {
            console.log(`🔍 Processing result:`, {
              success: result.success,
              orderId: result.orderId,
            });
            if (result.success && result.orderId) {
              for (const adminId of adminIds) {
                console.log(
                  `📨 Sending notification to admin ${adminId} for order ${result.orderId}`
                );
                await NotificationService.notifyAdminNewOrder(
                  this.bot,
                  result.orderId,
                  adminId
                );
              }
            }
          }
        } catch (error) {
          console.error("Error sending admin notifications:", error);
        }
      } else {
        console.log("❌ No successful orders to notify about");
      }

      // Очищаем корзину
      userState.cart = [];
      this.userStates.delete(userId);

      // Создаем постоянную клавиатуру для сообщения подтверждения
      const persistentKeyboard = BotUtils.createPersistentKeyboard();

      // Удаляем старое сообщение с таблицей товаров
      try {
        await ctx.telegram.deleteMessage(
          ctx.chat.id,
          ctx.callbackQuery.message.message_id
        );
      } catch (error) {
        console.log(`Could not delete old message: ${error.message}`);
      }

      // Отправляем новое сообщение с подтверждением заказа
      await ctx.reply(responseText, {
        parse_mode: "Markdown",
        ...persistentKeyboard,
      });
      await ctx.answerCbQuery("Заказ оформлен!");
    } catch (error) {
      await ctx.answerCbQuery("Ошибка при оформлении заказа");
      console.error("Order confirmation error:", error);
    }
  }

  /**
   * Обработчик команды "Мои заказы"
   */
  async handleMyOrdersCommand(ctx) {
    try {
      const orders = await OrderService.getUserOrders(ctx.from.id);

      if (orders.length === 0) {
        await ctx.reply("📋 У вас пока нет заказов");
        return;
      }

      let ordersText = "📋 *Ваши заказы поставщику:*\n\n";

      for (const order of orders) {
        const statusEmoji = BotUtils.getStatusEmoji(order.status);
        ordersText += `${statusEmoji} *${order.product.name}*\n`;
        ordersText += `Количество: ${order.quantity} шт.\n`;
        ordersText += `Цена: ${order.product.price * order.quantity} руб.\n`;
        ordersText += `Статус: ${BotUtils.getStatusText(order.status)}\n`;
        ordersText += `Дата: ${order.createdAt.toLocaleDateString("ru-RU")}\n`;
        ordersText += "\n";
      }

      await ctx.reply(ordersText, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("My orders error:", error);
      await ctx.reply("Произошла ошибка при получении заказов");
    }
  }

  /**
   * Обработчик команды "Статистика"
   */
  async handleStatsCommand(ctx) {
    try {
      const stats = await OrderService.getUserOrderStats(ctx.from.id);

      let statsText = "📊 *Статистика ваших заказов:*\n\n";
      statsText += `📦 Всего заказов: ${stats.totalOrders}\n`;
      statsText += `💰 Общая сумма: ${stats.totalAmount} руб.\n`;
      statsText += `📈 Средний чек: ${stats.averageOrder} руб.\n\n`;

      if (stats.statusCounts) {
        statsText += "*По статусам:*\n";
        for (const [status, count] of Object.entries(stats.statusCounts)) {
          const statusEmoji = BotUtils.getStatusEmoji(status);
          const statusText = BotUtils.getStatusText(status);
          statsText += `${statusEmoji} ${statusText}: ${count}\n`;
        }
      }

      await ctx.reply(statsText, { parse_mode: "Markdown" });
    } catch (error) {
      console.error("Stats error:", error);
      await ctx.reply("Произошла ошибка при получении статистики");
    }
  }
}

module.exports = BotController;
