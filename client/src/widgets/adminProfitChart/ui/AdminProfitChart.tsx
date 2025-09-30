import { useMemo } from "react";
import styles from "./AdminProfitChart.module.css";
import type { IOrder } from "@/entities";

type AdminProfitChartProps = {
  orders: IOrder[];
  loading?: boolean;
  error?: string | null;
  selectedDate?: string;
};

// Расширенный интерфейс для заказа с дополнительной информацией
interface ExtendedOrder extends IOrder {
  variant?: string;
  product?: {
    id: number;
    name: string;
    price: number;
    variants?: string[];
    variant_names?: string[];
  };
}

// Хардкод себестоимости продуктов
const PRODUCT_COSTS: Record<string, number> = {
  // Основные продукты
  'Пирог "Славянский"': 13.11,
  Провансалька: 14.51,
  "Плюшка с маком": 5.29,
  Ватрушка: 5.77,
  "Хот-дог": 20.4,
  "Сосиска в тесте": 9.68,
  Пицца: 9.11,
  Беляш: 10,
  "Горячая булка": 7,
  "Тесто дрожжевое": 23.35,
  Сырники: 10,
  "Запеканка творожная": 153.33,

  // Пироги с начинками - добавляем разные варианты написания
  "Пирог с творогом жар/печ": 6,
  "Пирог с повидлом жар/печ": 4.62,
  "Пирог с повидло жар/печ": 4.62,
  "Пирог с зеленым яйцом жар/печ": 8.39,
  "Пирог с капустой жар/печ": 3.77,
  "Пирог с яйцом жар/печ": 7.67,
  "Пирог с мясом": 10,
  "Пирог с печенкой жар/печ": 6.66,
  "Пирог с картошкой жар/печ": 3.64,
  "Пирог с яблоком": 6,

  // Пресные пироги
  "Пирог пресный с картошкой": 15,
  "Пирог пресный с капустой": 15,
  "Пирог пресный с яблоками": 15,
  "Пирог пресный с творогом": 15,
  "Пирог пресный с зеленым луком и яйцом": 15,
  "Пирог пресный с яйцом": 15,
  "Пирог пресный с курагой": 15,
};

// Простая функция для поиска себестоимости по названию продукта
const findProductCost = (productName: string): number => {
  // Ищем точное совпадение
  if (PRODUCT_COSTS[productName]) {
    console.log(
      `Found cost for "${productName}": ${PRODUCT_COSTS[productName]}`
    );
    return PRODUCT_COSTS[productName];
  }

  // Если ничего не найдено, выводим предупреждение
  console.warn(`No cost found for product: "${productName}"`);
  return 0;
};

export function AdminProfitChart({
  orders,
  loading = false,
  error = null,
  selectedDate,
}: AdminProfitChartProps) {
  // Форматируем дату для отображения
  const formatDate = (dateString: string) => {
    if (!dateString) return "Сегодня";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Неверная дата";

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

  // Вычисляем данные для диаграммы
  const profitData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const extendedOrders = orders as ExtendedOrder[];

    // Собираем все уникальные названия продуктов для отладки
    const allProductNames = new Set<string>();
    extendedOrders.forEach((order) => {
      const productName = order.product?.name || `Продукт #${order.product_id}`;
      allProductNames.add(productName);
    });

    console.log(
      "All product names from database:",
      Array.from(allProductNames)
    );
    const productStats = new Map<
      string,
      {
        totalQuantity: number;
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        productPrice: number;
        costPerUnit: number;
      }
    >();

    // Группируем заказы по продуктам
    extendedOrders.forEach((order) => {
      const productName = order.product?.name || `Продукт #${order.product_id}`;
      const productPrice = order.product?.price || 0;

      // Ищем себестоимость по названию продукта
      const costPerUnit = findProductCost(productName);

      // Отладочная информация
      console.log(
        "Product:",
        productName,
        "Price:",
        productPrice,
        "Cost:",
        costPerUnit,
        "Quantity:",
        order.quantity
      );

      if (productStats.has(productName)) {
        const stats = productStats.get(productName)!;
        stats.totalQuantity += order.quantity;
        stats.totalRevenue += order.quantity * productPrice;
        stats.totalCost += order.quantity * costPerUnit;
        stats.totalProfit = stats.totalRevenue - stats.totalCost;
      } else {
        const totalRevenue = order.quantity * productPrice;
        const totalCost = order.quantity * costPerUnit;
        productStats.set(productName, {
          totalQuantity: order.quantity,
          totalRevenue,
          totalCost,
          totalProfit: totalRevenue - totalCost,
          productPrice,
          costPerUnit,
        });
      }
    });

    // Преобразуем в массив и сортируем по прибыли
    const result = Array.from(productStats.entries())
      .map(([name, stats]) => ({
        name,
        ...stats,
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit);

    // Отладочная информация о результатах
    console.log("Profit calculation results:", result);
    console.log("Total products processed:", result.length);

    return result;
  }, [orders]);

  // Общие показатели
  const totalStats = useMemo(() => {
    return profitData.reduce(
      (acc, item) => ({
        totalRevenue: acc.totalRevenue + item.totalRevenue,
        totalCost: acc.totalCost + item.totalCost,
        totalProfit: acc.totalProfit + item.totalProfit,
        totalQuantity: acc.totalQuantity + item.totalQuantity,
      }),
      { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalQuantity: 0 }
    );
  }, [profitData]);

  // Если загрузка
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>Загрузка данных прибыли...</div>
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
        <div className={styles.emptyStateTitle}>
          Нет данных для анализа прибыли
        </div>
        <div className={styles.emptyStateDescription}>
          На {selectedDate ? formatDate(selectedDate) : "выбранную дату"} заказы
          не найдены
        </div>
      </div>
    );
  }

  // Максимальная прибыль для масштабирования диаграммы (включая общую прибыль)
  const maxProfit = Math.max(
    ...profitData.map((item) => item.totalProfit),
    totalStats.totalProfit
  );

  return (
    <div className={styles.profitChart}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          📈 Анализ прибыли за{" "}
          {selectedDate ? formatDate(selectedDate) : "выбранную дату"}
        </h2>
        <div className={styles.totalStats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Общая выручка</div>
            <div className={styles.statValue}>
              {totalStats.totalRevenue.toFixed(2)}₽
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Общие затраты</div>
            <div className={styles.statValue}>
              {totalStats.totalCost.toFixed(2)}₽
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Общая прибыль</div>
            <div className={`${styles.statValue} ${styles.profitValue}`}>
              {totalStats.totalProfit.toFixed(2)}₽
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Рентабельность</div>
            <div className={styles.statValue}>
              {totalStats.totalRevenue > 0
                ? (
                    (totalStats.totalProfit / totalStats.totalRevenue) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Прибыль по продуктам</h3>
        <div className={styles.chart}>
          {profitData.map((item) => {
            const barHeight =
              maxProfit > 0 ? (item.totalProfit / maxProfit) * 100 : 0;
            const profitabilityPercent =
              item.totalRevenue > 0
                ? (item.totalProfit / item.totalRevenue) * 100
                : 0;

            return (
              <div key={item.name} className={styles.chartItem}>
                <div className={styles.chartBar}>
                  <div
                    className={styles.barFill}
                    style={{
                      height: `${Math.max(barHeight, 2)}%`,
                      backgroundColor:
                        item.totalProfit >= 0
                          ? `hsl(${120 - profitabilityPercent * 1.2}, 70%, 50%)`
                          : "#dc3545",
                    }}
                    title={`${item.name}: ${item.totalProfit.toFixed(
                      2
                    )}₽ прибыли`}
                  />
                </div>
                <div className={styles.chartLabel}>
                  <div className={styles.productName} title={item.name}>
                    {item.name.length > 15
                      ? `${item.name.substring(0, 15)}...`
                      : item.name}
                  </div>
                  <div className={styles.productStats}>
                    <div className={styles.quantity}>
                      {item.totalQuantity} шт.
                    </div>
                    <div className={styles.profit}>
                      {item.totalProfit >= 0 ? "+" : ""}
                      {item.totalProfit.toFixed(0)}₽
                    </div>
                    <div className={styles.profitability}>
                      {profitabilityPercent.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Столбец общей прибыли */}
          <div className={`${styles.chartItem} ${styles.totalProfitItem}`}>
            <div className={styles.chartBar}>
              <div
                className={`${styles.barFill} ${styles.totalProfitBar}`}
                style={{
                  height: `${Math.max(
                    maxProfit > 0
                      ? (totalStats.totalProfit / maxProfit) * 100
                      : 0,
                    2
                  )}%`,
                  backgroundColor:
                    totalStats.totalProfit >= 0 ? "#28a745" : "#dc3545",
                }}
                title={`Общая прибыль: ${totalStats.totalProfit.toFixed(2)}₽`}
              />
            </div>
            <div className={styles.chartLabel}>
              <div
                className={`${styles.productName} ${styles.totalProfitName}`}
              >
                Общая прибыль
              </div>
              <div className={styles.productStats}>
                <div className={styles.quantity}>
                  {totalStats.totalQuantity} шт.
                </div>
                <div className={styles.profit}>
                  {totalStats.totalProfit >= 0 ? "+" : ""}
                  {totalStats.totalProfit.toFixed(0)}₽
                </div>
                <div className={styles.profitability}>
                  {totalStats.totalRevenue > 0
                    ? (
                        (totalStats.totalProfit / totalStats.totalRevenue) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailsTable}>
        <h3 className={styles.tableTitle}>Детальная информация</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Продукт</th>
                <th>Количество</th>
                <th>Цена за шт.</th>
                <th>Себестоимость</th>
                <th>Выручка</th>
                <th>Затраты</th>
                <th>Прибыль</th>
                <th>Рентабельность</th>
              </tr>
            </thead>
            <tbody>
              {profitData.map((item, index) => {
                const profitabilityPercent =
                  item.totalRevenue > 0
                    ? (item.totalProfit / item.totalRevenue) * 100
                    : 0;

                return (
                  <tr
                    key={item.name}
                    className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                  >
                    <td className={styles.productCell}>{item.name}</td>
                    <td>{item.totalQuantity}</td>
                    <td>{item.productPrice.toFixed(2)}₽</td>
                    <td>{item.costPerUnit.toFixed(2)}₽</td>
                    <td>{item.totalRevenue.toFixed(2)}₽</td>
                    <td>{item.totalCost.toFixed(2)}₽</td>
                    <td
                      className={
                        item.totalProfit >= 0
                          ? styles.positiveProfit
                          : styles.negativeProfit
                      }
                    >
                      {item.totalProfit >= 0 ? "+" : ""}
                      {item.totalProfit.toFixed(2)}₽
                    </td>
                    <td
                      className={
                        profitabilityPercent >= 0
                          ? styles.positivePercent
                          : styles.negativePercent
                      }
                    >
                      {profitabilityPercent.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}

              {/* Строка общей прибыли */}
              <tr className={styles.totalProfitRow}>
                <td
                  className={`${styles.productCell} ${styles.totalProfitCell}`}
                >
                  <strong>Общая прибыль</strong>
                </td>
                <td className={styles.totalProfitCell}>
                  <strong>{totalStats.totalQuantity}</strong>
                </td>
                <td className={styles.totalProfitCell}>
                  <strong>
                    {totalStats.totalQuantity > 0
                      ? (
                          totalStats.totalRevenue / totalStats.totalQuantity
                        ).toFixed(2)
                      : 0}
                    ₽
                  </strong>
                </td>
                <td className={styles.totalProfitCell}>
                  <strong>
                    {totalStats.totalQuantity > 0
                      ? (
                          totalStats.totalCost / totalStats.totalQuantity
                        ).toFixed(2)
                      : 0}
                    ₽
                  </strong>
                </td>
                <td className={styles.totalProfitCell}>
                  <strong>{totalStats.totalRevenue.toFixed(2)}₽</strong>
                </td>
                <td className={styles.totalProfitCell}>
                  <strong>{totalStats.totalCost.toFixed(2)}₽</strong>
                </td>
                <td
                  className={`${styles.totalProfitCell} ${
                    totalStats.totalProfit >= 0
                      ? styles.positiveProfit
                      : styles.negativeProfit
                  }`}
                >
                  <strong>
                    {totalStats.totalProfit >= 0 ? "+" : ""}
                    {totalStats.totalProfit.toFixed(2)}₽
                  </strong>
                </td>
                <td
                  className={`${styles.totalProfitCell} ${
                    totalStats.totalRevenue > 0 &&
                    (totalStats.totalProfit / totalStats.totalRevenue) * 100 >=
                      0
                      ? styles.positivePercent
                      : styles.negativePercent
                  }`}
                >
                  <strong>
                    {totalStats.totalRevenue > 0
                      ? (
                          (totalStats.totalProfit / totalStats.totalRevenue) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
