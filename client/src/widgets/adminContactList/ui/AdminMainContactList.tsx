import { useEffect, useState } from "react";
import styles from "./AdminMainContactList.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllContactsThunk, type MainContact } from "@/entities";
import { AdminMainContactForm } from "@/widgets/adminContactForm";
import { AdminMainContactCard } from "@/widgets/adminContactCard";

export function AdminMainContactList() {
  const dispatch = useAppDispatch();
  const { contacts } = useAppSelector((state) => state.contact);

  const [editOneContact, setEditOneContact] = useState(false);
  const [editOneContactId, setEditOneContactId] = useState(0);
  const [contactInput, setContactInput] = useState({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    address: "",
  });

  useEffect(() => {
    dispatch(getAllContactsThunk());
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {contacts.map((contact: MainContact) =>
        editOneContact && editOneContactId === contact.id ? (
          <AdminMainContactForm
            key={contact.id}
            contact={contact}
            dispatch={dispatch}
            setEditOne={setEditOneContact}
            editId={editOneContactId}
            formValues={contactInput}
            setFormValues={setContactInput}
          />
        ) : (
          <AdminMainContactCard
            key={contact.id}
            contact={contact}
            setEditOneContact={setEditOneContact}
            setEditOneContactId={setEditOneContactId}
            setContactInput={setContactInput}
          />
        )
      )}
    </div>
  );
}


