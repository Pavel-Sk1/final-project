import styles from "./AdminMainContactForm.module.css";
import { updateMainContactThunk, getAllContactsThunk } from "@/entities";
import { formatPhoneInputMask, normalizePhoneDigits } from "@/shared/lib/phone";
import type { AppDispatch } from "@/app/store/store";

type AdminMainContactFormProps = {
  contact: { id: number };
  dispatch: AppDispatch;
  setEditOne: (value: boolean) => void;
  editId: number;
  formValues: {
    name: string;
    email: string;
    phone: string;
    telegram: string;
    address: string;
  };
  setFormValues: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      phone: string;
      telegram: string;
      address: string;
    }>
  >;
};

export function AdminMainContactForm({
  contact,
  dispatch,
  setEditOne,
  editId,
  formValues,
  setFormValues,
}: AdminMainContactFormProps) {
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "phone") {
      const formatted = formatPhoneInputMask(value);
      setFormValues((prev) => ({ ...prev, phone: formatted }));
      return;
    }
    if (name === "address") {
      const next = value;
      if (next.trim() === "") {
        setFormValues((prev) => ({ ...prev, address: "ул. " }));
        return;
      }
      setFormValues((prev) => ({ ...prev, address: next }));
      return;
    }
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const normalizedPhone = normalizePhoneDigits(formValues.phone);
      await dispatch(
        updateMainContactThunk({
          id: editId,
          mainContact: {
            id: contact.id,
            name: formValues.name || undefined,
            email: formValues.email || undefined,
            phone: normalizedPhone || undefined,
            telegram: formValues.telegram || undefined,
            address: formValues.address || undefined,
          },
        })
      ).unwrap();
      await dispatch(getAllContactsThunk()).unwrap();
      setEditOne(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form key={contact.id} className={styles.editForm} onSubmit={onSubmitHandler}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.formLabel}>Имя</label>
        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={formValues.name}
          onChange={onChangeHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={onChangeHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.formLabel}>Телефон</label>
        <input
          type="text"
          name="phone"
          placeholder="Телефон"
          value={formValues.phone}
          onChange={onChangeHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="telegram" className={styles.formLabel}>Telegram</label>
        <input
          type="text"
          name="telegram"
          placeholder="Telegram"
          value={formValues.telegram}
          onChange={onChangeHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="address" className={styles.formLabel}>Адрес</label>
        <input
          type="text"
          name="address"
          placeholder="Улица, Номер дома, Город"
          value={formValues.address}
          onChange={onChangeHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>
          Сохранить
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => setEditOne(false)}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}


