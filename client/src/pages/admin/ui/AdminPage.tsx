import styles from "./AdminPage.module.css";
import { useState } from "react";

import { AdminNewsList, AdminProductList } from "@/widgets";

export function AdminPage() {
  const [editNews, setEditNews] = useState(false);
  const [editProduct, setEditProduct] = useState(false);

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
      </div>
    </div>
  );
}
