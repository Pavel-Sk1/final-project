import { useMemo, useState } from "react";
import styles from "./AdminPartnerCard.module.css";
import { useAppDispatch, EditModal } from "@/shared";
import { deletePartnerThunk, editOnePartner, type IPartner } from "@/entities";
import { AdminPartnerForm } from "@/widgets";

type AdminPartnerCardProps = {
  partner: IPartner;  
};

export function AdminPartnerCard({
  partner,  
}: AdminPartnerCardProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const memoizedPartnerForm = useMemo(() => {
    return (
      <AdminPartnerForm
        partner={partner}
        onClose={() => setIsOpen(false)}
        setCreatePartner={null}
      />
    )
  }, [partner, setIsOpen])
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
        <p className={`${styles.itemDescription} ${styles.statusItem} ${
          partner.status === 'active' ? styles.statusActive :
          partner.status === 'inactive' ? styles.statusInactive :
          partner.status === 'pending' ? styles.statusPending :
          partner.status === 'suspended' ? styles.statusSuspended : ''
        }`}>
          {partner.status === 'active' && 'Активный'}
          {partner.status === 'inactive' && 'Неактивный'}
          {partner.status === 'pending' && 'Ожидает'}
          {partner.status === 'suspended' && 'Приостановлен'}
          {!['active', 'inactive', 'pending', 'suspended'].includes(partner.status) && partner.status}
        </p>
      </div>
      <div className={styles.itemActions}>
        <button
          className={styles.editButton}
          onClick={() => {
            dispatch(editOnePartner(partner));
            setIsOpen(true);
          }}
        >
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={deletePartnerHandler}>
          Удалить
        </button>
      </div>
      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        memoizedContent={memoizedPartnerForm}
      />
    </div>
  );
}
