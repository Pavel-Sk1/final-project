import styles from "./UserOrders.module.css";

export function UserOrders() {
  return (
    <div className={styles.ordersSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Мои заказы</h2>
      </div>
      <div className={styles.ordersContent}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h3 className={styles.emptyTitle}>Заказов пока нет</h3>
          <p className={styles.emptyDescription}>
            Когда вы сделаете заказ, он появится здесь
          </p>
        </div>
      </div>
    </div>
  );
}
