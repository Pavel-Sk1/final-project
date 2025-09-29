import styles from "./AdminPartnerCard.module.css";
import { useAppDispatch } from "@/shared";
import type { IPartner } from "@/entities";
import { deletePartnerThunk } from "@/entities";

type AdminPartnerCardProps = {
  partner: IPartner;
  setEditOnePartner: (value: boolean) => void;
  setEditOnePartnerId: (value: number) => void;
};

export function AdminPartnerCard({
  partner,
  setEditOnePartner,
  setEditOnePartnerId,
}: AdminPartnerCardProps) {
  const dispatch = useAppDispatch();
  const deletePartnerHandler = () => {
    try {
      dispatch(deletePartnerThunk(partner.id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.partnerItem}>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{partner.company_name}</h3>
        <p className={styles.itemDescription}>{partner.inn}</p>
        <p className={styles.itemDescription}>{partner.ogrn}</p>
        <p className={styles.itemDescription}>{partner.address}</p>
        <p className={styles.itemDescription}>{partner.contact_person}</p>
        <p className={styles.itemDescription}>{partner.contact_email}</p>
        <p className={styles.itemDescription}>{partner.contact_phone}</p>
        <p className={styles.itemDescription}>{partner.comment}</p>
        <p className={`${styles.itemDescription} ${styles.statusItem}`}>
          {partner.status === "active" && "✅ Активный"}
          {partner.status === "inactive" && "❌ Неактивный"}
          {partner.status === "pending" && "⏳ Ожидает"}
          {partner.status === "suspended" && "⏸️ Приостановлен"}
          {!["active", "inactive", "pending", "suspended"].includes(
            partner.status
          ) && partner.status}
        </p>
      </div>
      <div className={styles.itemActions}>
        <button
          className={styles.editButton}
          onClick={() => {
            setEditOnePartner(true);
            setEditOnePartnerId(partner.id);
          }}
        >
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={deletePartnerHandler}>
          Удалить
        </button>
      </div>
    </div>
  );
}
