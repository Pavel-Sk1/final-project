import styles from "./AdminPage.module.css";
import { useState } from "react";

import { AdminNewsList, AdminProductList } from "@/widgets";

export function AdminPage() {
  const [editNews, setEditNews] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [tab, setTab] = useState("editMainPage");

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Панель администратора</h1>
        <div className={styles.adminNav}>
          <button
            className={tab === "editMainPage" ? "active" : ""}
            onClick={() => setTab("editMainPage")}
          >
            Редактировать главную страницу
          </button>
          <button
            className={tab === "statistics" ? "active" : ""}
            onClick={() => setTab("statistics")}
          >
            Статистика заказов
          </button>
          <button
            className={tab === "regCompanies" ? "active" : ""}
            onClick={() => setTab("regCompanies")}
          >
            Зарегистрировать дистрибьютора
          </button>
          <button
            className={tab === "manageProducts" ? "active" : ""}
            onClick={() => setTab("manageProducts")}
          >
            Управление продуктами
          </button>
        </div>
        {tab === "editMainPage" && (
          <>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Редактировать новости на главной странице
                </h2>
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
                <h2 className={styles.sectionTitle}>
                  Редактировать изображения продуктов на главной странице
                </h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setEditProduct((prev) => !prev)}
                >
                  {editProduct ? "Скрыть" : "Редактировать"}
                </button>
              </div>

              {editProduct && <AdminProductList />}
            </section>
          </>
        )}
        {tab === "statistics" && <></>}
        {tab === "regCompanies" && <></>}
        {tab === "manageProducts" && <></>}
      </div>
    </div>
  );
}
