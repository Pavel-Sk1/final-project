import { useEffect, useState } from "react";
import styles from "./AdminPartnerForm.module.css";
import {
  createPartnerThunk,
  updatePartnerThunk,
  type IPartnerWithUser,
  type ICreatePartnerWithUser,
  deleteOnePartner,
  signUpThunk,
  updateUserThunk,
} from "@/entities";
import { useAppDispatch } from "@/shared";

const initialPartnerInput: ICreatePartnerWithUser = {
  login: "",
  phone: "",
  password: "",
  role_id: 0,
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
  partner: IPartnerWithUser | null;
  onClose: (() => void) | null;
};

export function AdminPartnerForm({
  setCreatePartner = null,
  partner = null,
  onClose = null,
}: AdminPartnerFormProps) {
  const dispatch = useAppDispatch();
  // const { userToCreate } = useAppSelector((state) => state.user);

  const [partnerInput, setPartnerInput] = useState<ICreatePartnerWithUser>(
    partner
      ? {
          login: partner.user.login,
          password: "",
          phone: partner.user.phone,
          role_id: partner.user.role_id,
          company_name: partner.company_name,
          inn: partner.inn,
          ogrn: partner.ogrn,
          address: partner.address,
          contact_person: partner.contact_person,
          contact_email: partner.contact_email,
          contact_phone: partner.contact_phone,
          comment: partner.comment,
          status: partner.status,
        }
      : initialPartnerInput
  );

  useEffect(() => {
    if (partner) {
      setPartnerInput({
        login: partner.user.login,
        password: "",
        phone: partner.user.phone,
        role_id: partner.user.role_id,
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

  const onChangePartnerHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPartnerInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmitPartnerHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      if (partner) {
        const partnerToUpdate = {
          company_name: partnerInput.company_name,
          inn: partnerInput.inn,
          ogrn: partnerInput.ogrn,
          address: partnerInput.address,
          contact_person: partnerInput.contact_person,
          contact_email: partnerInput.contact_email,
          contact_phone: partnerInput.contact_phone,
          comment: partnerInput.comment,
          status: partnerInput.status,
          user_id: partner.user.id,
        };
        const userToUpdate = {
          login: partnerInput.login,
          password: partnerInput.password || "",
          phone: partnerInput.phone,
          role_id: partnerInput.role_id,
        };
        const updateUserResult = await dispatch(
          updateUserThunk({ id: partner.user.id, userData: userToUpdate })
        );
        if (
          updateUserThunk.fulfilled.match(updateUserResult) &&
          updateUserResult.payload.data.user
        ) {
          await dispatch(
            updatePartnerThunk({ id: partner.id, partner: partnerToUpdate })
          );
        }
      } else {
        const signUpResult = await dispatch(
          signUpThunk({
            login: partnerInput.login,
            password: partnerInput.password || "",
            phone: partnerInput.phone,
            role_id: partnerInput.role_id,
          })
        );

        // Проверяем, что регистрация прошла успешно
        if (
          signUpThunk.fulfilled.match(signUpResult) &&
          signUpResult.payload.data.user
        ) {
          const createdUser = signUpResult.payload.data.user;
          const partnerToCreate = {
            company_name: partnerInput.company_name,
            inn: partnerInput.inn,
            ogrn: partnerInput.ogrn,
            address: partnerInput.address,
            contact_person: partnerInput.contact_person,
            contact_email: partnerInput.contact_email,
            contact_phone: partnerInput.contact_phone,
            comment: partnerInput.comment,
            status: partnerInput.status,
            user_id: createdUser.id,
          };
          await dispatch(createPartnerThunk(partnerToCreate));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPartnerInput(initialPartnerInput);
      setCreatePartner?.(false);
      onClose?.();
      dispatch(deleteOnePartner());
    }
  };

  return (
    <form className={styles.editForm} onSubmit={onSubmitPartnerHandler}>
      <div className={styles.formGroup}>
        <label htmlFor="login">Логин</label>
        <input
          id="login"
          type="text"
          name="login"
          placeholder="Введите логин"
          value={partnerInput.login}
          onChange={onChangePartnerHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder={partner ? "Введите новый пароль" : "Введите пароль"}
          value={partnerInput.password}
          onChange={onChangePartnerHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phone">Телефон</label>
        <input
          id="phone"
          type="text"
          name="phone"
          placeholder="Введите телефон"
          value={partnerInput.phone}
          onChange={onChangePartnerHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="role_id">Роль</label>
        <select
          id="role_id"
          name="role_id"
          value={partnerInput.role_id}
          onChange={onChangePartnerHandler}
          className={styles.formInput}
        >
          <option value="">Выберите роль</option>
          <option value={1}>Администратор</option>
          <option value={2}>Пользователь</option>
        </select>
      </div>
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
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => {
            setCreatePartner?.(false);
            onClose?.();
            dispatch(deleteOnePartner());
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
