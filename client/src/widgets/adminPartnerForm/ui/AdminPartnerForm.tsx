import { useEffect, useState } from "react";
import styles from "./AdminPartnerForm.module.css";
import {
  createPartnerThunk,
  updatePartnerThunk,
  type IPartner,
  type ICreatePartner,
} from "@/entities";
import { useAppDispatch } from "@/shared";

const initialPartnerInput: ICreatePartner = {
  company_name: "",
  inn: "",
  ogrn: "",
  address: "",
  contact_person: "",
  contact_email: "",
  contact_phone: "",
  comment: "",
  status: "",
};

type AdminPartnerFormProps = {
  setCreatePartner: React.Dispatch<React.SetStateAction<boolean>> | null;
  partner: IPartner | null;
  setEditOnePartner: React.Dispatch<React.SetStateAction<boolean>> | null;
};

export function AdminPartnerForm({
  setCreatePartner = null,
  partner = null,
  setEditOnePartner = null,
}: AdminPartnerFormProps) {
  const dispatch = useAppDispatch();
  
  const [partnerInput, setPartnerInput] = useState<ICreatePartner | IPartner>(
    initialPartnerInput
  );

  useEffect(() => {
    if (partner) {
      setPartnerInput({
        company_name: partner.company_name,
        inn: partner.inn,
        ogrn: partner.ogrn,
        address: partner.address,
        contact_person: partner.contact_person,
        contact_email: partner.contact_email,
        contact_phone: partner.contact_phone,
        comment: partner.comment,
        status: partner.status,
      });
    }
  }, [partner]);

  const onChangePartnerHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setPartnerInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  
  const onSubmitPartnerHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (partner) {
        dispatch(updatePartnerThunk({ id: partner.id, partner: partnerInput }));
      } else {
        dispatch(createPartnerThunk(partnerInput));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPartnerInput(initialPartnerInput);
      setCreatePartner?.(false);
      setEditOnePartner?.(false);
    }
  };

  return (
    <form className={styles.editForm} onSubmit={onSubmitPartnerHandler}>
      <div className={styles.formGroup}>
        <label htmlFor="company_name">Название компании</label>
        <input
        id="company_name"
        type="text"
        name="company_name"
        placeholder="Введите название компании"
        value={partnerInput.company_name}
        onChange={onChangePartnerHandler}
        className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="inn">ИНН</label>
        <input
        id="inn"
        type="text"
        name="inn"
        placeholder="Введите ИНН"
        value={partnerInput.inn}
        onChange={onChangePartnerHandler}
        className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="ogrn">ОГРН</label>
        <input
        id="ogrn"
        type="text"
        name="ogrn"
        placeholder="Введите ОГРН"
        value={partnerInput.ogrn}
        onChange={onChangePartnerHandler}
        className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="address">Адрес</label>
        <input
        id="address"
        type="text"
        name="address"
        placeholder="Введите адрес"
        value={partnerInput.address}
        onChange={onChangePartnerHandler}
        className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="contact_person">Контактное лицо</label>
        <input
        id="contact_person"
        type="text"
        name="contact_person"
        placeholder="Введите контактное лицо"
        value={partnerInput.contact_person}
        onChange={onChangePartnerHandler}
        className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="contact_email">Email</label>
        <input
        id="contact_email"
        type="email"
        name="contact_email"
        placeholder="Введите email"
        value={partnerInput.contact_email}
        onChange={onChangePartnerHandler}
        className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="contact_phone">Телефон</label>
        <input
        id="contact_phone"
        type="tel"
        name="contact_phone"
        placeholder="Введите телефон"
        value={partnerInput.contact_phone}
        onChange={onChangePartnerHandler}
        className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="comment">Комментарий</label>
        <textarea
        id="comment"
        name="comment"
        placeholder="Введите комментарий"
        value={partnerInput.comment}
        onChange={onChangePartnerHandler}
        className={styles.formTextarea}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="status">Статус</label>
        <select
          id="status"
          name="status"
          value={partnerInput.status}
          onChange={onChangePartnerHandler}
          className={styles.formInput}
        >
          <option value="">Выберите статус</option>
          <option value="active">Активный</option>
          <option value="inactive">Неактивный</option>
          <option value="pending">Ожидает</option>
          <option value="suspended">Приостановлен</option>
        </select>
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>
          Сохранить
        </button>
        <button type="button" className={styles.cancelButton} onClick={() => setCreatePartner?.(false)}>
          Отмена
        </button>
      </div>
    </form>
  );
}
