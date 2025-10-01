import { useMemo, useState } from "react";
import styles from "./AdminProfitChart.module.css";
import type { IOrder } from "@/entities";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

type AdminProfitChartProps = {
  orders: IOrder[];
  loading?: boolean;
  error?: string | null;
  selectedDate?: string;
};

type FilterPeriod = "all" | "today" | "week" | "month" | "custom";

// Расширенный интерфейс для заказа с дополнительной информацией
interface ExtendedOrderItem {
  product_id: number;
  quantity: number;
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
  // Состояние для фильтров
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");

  // Функция для фильтрации заказов по периоду
  const getFilteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (filterPeriod) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = new Date(now);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case "custom":
        if (customDateFrom && customDateTo) {
          startDate = new Date(customDateFrom);
          endDate = new Date(customDateTo);
          endDate.setHours(23, 59, 59, 999); // Включаем весь день
        }
        break;
      case "all":
      default:
        return orders; // Возвращаем все заказы
    }

    if (!startDate || !endDate) return orders;

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate! && orderDate < endDate!;
    });
  }, [orders, filterPeriod, customDateFrom, customDateTo]);

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
    if (!getFilteredOrders || getFilteredOrders.length === 0) return [];

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

  // Данные для графиков Chart.js
  const chartData = useMemo(() => {
    // Топ-10 продуктов по прибыли
    const topProducts = profitData.slice(0, 10);

    return {
      // Данные для столбчатой диаграммы прибыли
      barChart: {
        labels: topProducts.map((item) =>
          item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name
        ),
        datasets: [
          {
            label: "Прибыль (₽)",
            data: topProducts.map((item) => item.totalProfit),
            backgroundColor: topProducts.map(
              (_, index) => `hsl(${(index * 36) % 360}, 70%, 50%)`
            ),
            borderColor: topProducts.map(
              (_, index) => `hsl(${(index * 36) % 360}, 70%, 40%)`
            ),
            borderWidth: 2,
          },
        ],
      },

      // Данные для круговой диаграммы выручки
      doughnutChart: {
        labels: topProducts.map((item) =>
          item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name
        ),
        datasets: [
          {
            data: topProducts.map((item) => item.totalRevenue),
            backgroundColor: topProducts.map(
              (_, index) => `hsl(${(index * 36) % 360}, 70%, 60%)`
            ),
            borderColor: topProducts.map(
              (_, index) => `hsl(${(index * 36) % 360}, 70%, 40%)`
            ),
            borderWidth: 2,
          },
        ],
      },

      // Данные для линейного графика рентабельности
      lineChart: {
        labels: topProducts.map((item) =>
          item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name
        ),
        datasets: [
          {
            label: "Рентабельность (%)",
            data: topProducts.map((item) =>
              item.totalRevenue > 0
                ? (item.totalProfit / item.totalRevenue) * 100
                : 0
            ),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
    };
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

  return (
    <div className={styles.profitChart}>
      {/* Фильтры по периодам */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Период:</label>
          <select
            className={styles.filterSelect}
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as FilterPeriod)}
          >
            <option value="all">Все время</option>
            <option value="today">Сегодня</option>
            <option value="week">Последние 7 дней</option>
            <option value="month">Текущий месяц</option>
            <option value="custom">Выбранный период</option>
          </select>
        </div>

        {filterPeriod === "custom" && (
          <div className={styles.customDateGroup}>
            <input
              type="date"
              className={styles.dateInput}
              value={customDateFrom}
              onChange={(e) => setCustomDateFrom(e.target.value)}
              placeholder="От"
            />
            <span className={styles.dateSeparator}>—</span>
            <input
              type="date"
              className={styles.dateInput}
              value={customDateTo}
              onChange={(e) => setCustomDateTo(e.target.value)}
              placeholder="До"
            />
          </div>
        )}
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>
          📈 Анализ прибыли за{" "}
          {selectedDate ? formatDate(selectedDate) : getPeriodTitle()}
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

      {/* Новые графики Chart.js */}
      <div className={styles.modernChartsContainer}>
        <div className={styles.chartsGrid}>
          {/* Столбчатая диаграмма прибыли */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>
              📊 Топ-10 продуктов по прибыли
            </h3>
            <div className={styles.chartWrapper}>
              <Bar
                data={chartData.barChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: false,
                    },
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `Прибыль: ${context.parsed.y.toFixed(2)}₽`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return value.toFixed(0) + "₽";
                        },
                      },
                    },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Круговая диаграмма выручки */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>🥧 Распределение выручки</h3>
            <div className={styles.chartWrapper}>
              <Doughnut
                data={chartData.doughnutChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom" as const,
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const total = context.dataset.data.reduce(
                            (a: number, b: number) => a + b,
                            0
                          );
                          const percentage = (
                            (context.parsed / total) *
                            100
                          ).toFixed(1);
                          return `${context.label}: ${context.parsed.toFixed(
                            2
                          )}₽ (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Линейный график рентабельности */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>📈 Рентабельность продуктов</h3>
            <div className={styles.chartWrapper}>
              <Line
                data={chartData.lineChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `Рентабельность: ${context.parsed.y.toFixed(
                            1
                          )}%`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return value.toFixed(0) + "%";
                        },
                      },
                    },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                      },
                    },
                  },
                }}
              />
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
