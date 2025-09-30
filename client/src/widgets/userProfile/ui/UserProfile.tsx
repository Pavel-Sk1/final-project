import styles from "./UserProfile.module.css";
import { type IUser } from "@/entities";

type UserProfileProps = {
  user: IUser;
};

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className={styles.profileContainer}>
      {user.partner ? (
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Информация о компании</h2>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileItem}>
              <span className={styles.label}>Название компании:</span>
              <span className={styles.value}>{user.partner.company_name}</span>
            </div>
            {user.partner.inn && (
              <div className={styles.profileItem}>
                <span className={styles.label}>ИНН:</span>
                <span className={styles.value}>{user.partner.inn}</span>
              </div>
            )}
            {user.partner.ogrn && (
              <div className={styles.profileItem}>
                <span className={styles.label}>ОГРН:</span>
                <span className={styles.value}>{user.partner.ogrn}</span>
              </div>
            )}
            {user.partner.address && (
              <div className={styles.profileItem}>
                <span className={styles.label}>Адрес:</span>
                <span className={styles.value}>{user.partner.address}</span>
              </div>
            )}
            {user.partner.contact_person && (
              <div className={styles.profileItem}>
                <span className={styles.label}>Контактное лицо:</span>
                <span className={styles.value}>{user.partner.contact_person}</span>
              </div>
            )}
            {user.partner.contact_email && (
              <div className={styles.profileItem}>
                <span className={styles.label}>Email компании:</span>
                <span className={styles.value}>{user.partner.contact_email}</span>
              </div>
            )}
            {user.partner.contact_phone && (
              <div className={styles.profileItem}>
                <span className={styles.label}>Телефон:</span>
                <span className={styles.value}>{user.partner.contact_phone}</span>
              </div>
            )}
            {user.partner.comment && (
              <div className={styles.profileItem}>
                <span className={styles.label}>Комментарий:</span>
                <span className={styles.value}>{user.partner.comment}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Информация о компании</h2>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.noDataMessage}>
              <p>Информация о компании не найдена.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
