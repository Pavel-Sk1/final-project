import styles from "./AdminPage.module.css";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { getOrdersByDateThunk } from "@/entities";

import { AdminNewsList, AdminProductList } from "@/widgets";
import { AdminCalculationsPage } from "@/widgets/adminCalculationsPage";

export function AdminPage() {
  const [editNews, setEditNews] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [editCalculations, setEditCalculations] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Устанавливаем сегодняшнюю дату по умолчанию
    return new Date().toISOString().split("T")[0];
  });

  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(
    (state) => state.calculations
  );

  // Загружаем заказы при открытии раздела расчетов или изменении даты
  useEffect(() => {
    if (editCalculations && selectedDate) {
      dispatch(
        getOrdersByDateThunk({ date: selectedDate, status: "confirmed" })
      );
    }
  }, [editCalculations, selectedDate, dispatch]);

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Панель администратора</h1>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Новости на главной странице</h2>
            <button
              className={styles.toggleButton}
              onClick={() => setEditNews((prev) => !prev)}
            >
              {editNews ? "Скрыть" : "Редактировать"}
            </button>
          </div>

          {editNews && <AdminNewsList />}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Изображения продуктов</h2>
            <button
              className={styles.toggleButton}
              onClick={() => setEditProduct((prev) => !prev)}
            >
              {editProduct ? "Скрыть" : "Редактировать"}
            </button>
          </div>

          {editProduct && <AdminProductList />}
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Расчеты</h2>
            <button
              className={styles.toggleButton}
              onClick={() => setEditCalculations((prev) => !prev)}
            >
              {editCalculations ? "Скрыть" : "Редактировать"}
            </button>
          </div>

          {editCalculations && (
            <div>
              <div
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <label
                  htmlFor="orderDate"
                  style={{ fontWeight: "500", color: "#374151" }}
                >
                  📅 Дата заказов:
                </label>
                <input
                  type="date"
                  id="orderDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    fontSize: "14px",
                    minWidth: "150px",
                  }}
                />
                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                  ✅ Только подтвержденные заказы
                </div>
              </div>
              <AdminCalculationsPage
                orders={orders}
                loading={loading}
                error={error}
                selectedDate={selectedDate}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
