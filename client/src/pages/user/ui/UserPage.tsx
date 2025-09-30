import styles from "./UserPage.module.css";
import { useState } from "react";
import { useAppSelector } from "@/shared/hooks";
import { UserProfile, UserOrders } from "@/widgets";

export function UserPage() {
  const [tab, setTab] = useState("profile");
  const { user, loading, error } = useAppSelector((state) => state.user);


  if (loading) {
    return (
      <div className={styles.userPage}>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.userPage}>
        <div className={styles.container}>
          <div className={styles.error}>Ошибка: {error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.userPage}>
        <div className={styles.container}>
          <div className={styles.error}>Пользователь не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Личный кабинет</h1>
        <div className={styles.userNav}>
          <button
            className={tab === "profile" ? "active" : ""}
            onClick={() => setTab("profile")}
          >
            Профиль
          </button>
          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            Мои заказы
          </button>
        </div>
        
        {tab === "profile" && <UserProfile user={user} />}
        {tab === "orders" && <UserOrders />}
      </div>
    </div>
  );
}
