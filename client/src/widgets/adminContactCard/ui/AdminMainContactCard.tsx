import { type MainContact } from "@/entities";
import styles from "./AdminMainContactCard.module.css";

type AdminMainContactCardProps = {
  contact: MainContact;
  setEditOneContact: (value: boolean) => void;
  setEditOneContactId: (value: number) => void;
  setContactInput: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      telegram: string;
      address: string;
    }>
  >;
};

export function AdminMainContactCard({
  contact,
  setEditOneContact,
  setEditOneContactId,
  setContactInput,
}: AdminMainContactCardProps) {
  return (
    <div key={contact.id} className={styles.item}>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{contact.name || "—"}</h3>
        <p className={styles.itemText}>Имя: {contact.email || "—"}</p>
        <p className={styles.itemText}>Телефон: {String(contact.phone ?? "") || "—"}</p>
        <p className={styles.itemText}>Telegram: {contact.telegram || "—"}</p>
        <p className={styles.itemText}>Адрес: {contact.address || "—"}</p>
      </div>
      <div className={styles.itemActions}>
        <button
          className={styles.editButton}
          onClick={() => {
            setEditOneContact(true);
            setEditOneContactId(contact.id);
            setContactInput({
              name: contact.name || "",
              email: contact.email || "",
              phone: contact.phone ? String(contact.phone) : "",
              telegram: contact.telegram || "",
              address: contact.address || "",
            });
          }}
        >
          Редактировать
        </button>
      </div>
    </div>
  );
}


