import styles from "./AdminCalculationsPage.module.css";
import type { IOrder } from "@/entities";

type AdminCalculationsPageProps = {
  orders: IOrder[];
  loading?: boolean;
  error?: string | null;
  selectedDate?: string;
};

// Расширенный интерфейс для заказа с дополнительной информацией
interface ExtendedOrder extends IOrder {
  product?: {
    id: number;
    name: string;
    price: number;
  };
  tgUser?: {
    tg_user_id: string;
    first_name?: string;
    last_name?: string;
    tg_username?: string;
  };
}

export function AdminCalculationsPage({
  orders,
  loading = false,
  error = null,
  selectedDate,
}: AdminCalculationsPageProps) {
  // Форматируем дату для отображения
  const formatDate = (dateString: string) => {
    if (!dateString) return "Сегодня";

    try {
      const date = new Date(dateString);

      // Проверяем, что дата валидна
      if (isNaN(date.getTime())) {
        return "Неверная дата";
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Сегодня";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Вчера";
      } else {
        return date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Неверная дата";
    }
  };

  // Если загрузка
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>Загрузка заказов...</div>
      </div>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <div className={styles.errorTitle}>Ошибка загрузки</div>
        <div className={styles.errorDescription}>{error}</div>
      </div>
    );
  }

  // Если нет заказов
  if (!orders || orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📊</div>
        <div className={styles.emptyStateTitle}>Нет подтвержденных заказов</div>
        <div className={styles.emptyStateDescription}>
          На {selectedDate ? formatDate(selectedDate) : "выбранную дату"}{" "}
          подтвержденные заказы не найдены
        </div>
      </div>
    );
  }

  // Приводим заказы к расширенному типу
  const extendedOrders = orders as ExtendedOrder[];

  // Дополнительная проверка на случай, если orders пришел как пустой массив
  if (!extendedOrders || extendedOrders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📊</div>
        <div className={styles.emptyStateTitle}>Нет подтвержденных заказов</div>
        <div className={styles.emptyStateDescription}>
          На {selectedDate ? formatDate(selectedDate) : "выбранную дату"}{" "}
          подтвержденные заказы не найдены
        </div>
      </div>
    );
  }

  // Получаем уникальные tg_user_id с информацией о пользователях
  const userMap = new Map<string, { name: string; username?: string }>();
  extendedOrders.forEach((order) => {
    if (order.tgUser) {
      const displayName =
        order.tgUser.first_name ||
        order.tgUser.tg_username ||
        `ID: ${order.tgUser.tg_user_id}`;
      userMap.set(order.tgUser.tg_user_id, {
        name: displayName,
        username: order.tgUser.tg_username,
      });
    }
  });

  const uniqueUserIds = Array.from(userMap.keys());

  // Получаем уникальные продукты и создаем объект для группировки
  const productMap = new Map<number, { name: string; price: number }>();
  const productOrdersMap = new Map<number, Map<string, number>>();

  extendedOrders.forEach((order) => {
    // Сохраняем информацию о продукте
    if (order.product) {
      productMap.set(order.product.id, {
        name: order.product.name,
        price: order.product.price,
      });
    }

    // Группируем заказы по продуктам и пользователям
    if (!productOrdersMap.has(order.product_id)) {
      productOrdersMap.set(order.product_id, new Map());
    }

    const userOrdersMap = productOrdersMap.get(order.product_id)!;
    const currentQuantity = userOrdersMap.get(order.tg_user_id) || 0;
    userOrdersMap.set(order.tg_user_id, currentQuantity + order.quantity);
  });

  // Вычисляем общие суммы
  const totalByUser = new Map<string, number>();
  const totalByProduct = new Map<number, number>();

  productOrdersMap.forEach((userOrdersMap, productId) => {
    const product = productMap.get(productId);
    if (!product) return;

    let productTotal = 0;
    userOrdersMap.forEach((quantity, userId) => {
      const userTotal = totalByUser.get(userId) || 0;
      totalByUser.set(userId, userTotal + quantity * product.price);
      productTotal += quantity * product.price;
    });
    totalByProduct.set(productId, productTotal);
  });

  return (
    <div className={styles.calculationsTable}>
      <div
        style={{
          marginBottom: "16px",
          fontSize: "16px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        ✅ Подтвержденные заказы за{" "}
        {selectedDate ? formatDate(selectedDate) : "выбранную дату"} (
        {orders.length} заказов)
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Продукт</th>
            {uniqueUserIds.map((userId) => {
              const userInfo = userMap.get(userId);
              return (
                <th
                  key={userId}
                  className={styles.tableHeader}
                  title={
                    userInfo?.username ? `@${userInfo.username}` : undefined
                  }
                >
                  {userInfo?.name || userId}
                </th>
              );
            })}
            <th className={styles.tableHeader}>Итого</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(productOrdersMap.entries()).map(
            ([productId, userOrdersMap]) => {
              const product = productMap.get(productId);
              return (
                <tr key={productId}>
                  <td
                    className={styles.tableCell}
                    title={`Цена: ${product?.price || 0}₽`}
                  >
                    {product?.name || `Продукт #${productId}`}
                  </td>
                  {uniqueUserIds.map((userId) => {
                    const quantity = userOrdersMap.get(userId) || 0;
                    const product = productMap.get(productId);
                    const total = quantity * (product?.price || 0);
                    return (
                      <td
                        key={userId}
                        className={styles.tableCell}
                        title={`${quantity} × ${
                          product?.price || 0
                        }₽ = ${total}₽`}
                      >
                        {quantity}
                      </td>
                    );
                  })}
                  <td
                    className={styles.tableCell}
                    style={{ fontWeight: "bold", backgroundColor: "#f0f9ff" }}
                  >
                    {totalByProduct.get(productId) || 0}₽
                  </td>
                </tr>
              );
            }
          )}
          <tr style={{ backgroundColor: "#f8fafc", fontWeight: "bold" }}>
            <td
              className={styles.tableCell}
              style={{ backgroundColor: "#e0f2fe" }}
            >
              ИТОГО
            </td>
            {uniqueUserIds.map((userId) => {
              const userTotal = totalByUser.get(userId) || 0;
              return (
                <td
                  key={userId}
                  className={styles.tableCell}
                  style={{ backgroundColor: "#e0f2fe" }}
                >
                  {userTotal}₽
                </td>
              );
            })}
            <td
              className={styles.tableCell}
              style={{ backgroundColor: "#bae6fd", fontWeight: "bold" }}
            >
              {Array.from(totalByUser.values()).reduce(
                (sum, total) => sum + total,
                0
              )}
              ₽
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
