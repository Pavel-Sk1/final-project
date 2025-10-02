import { useEffect, useState } from "react";
import styles from "./AdminPartnerForm.module.css";
import {
  createPartnerThunk,
  updatePartnerThunk,
  type IPartnerWithUser,
  type ICreatePartnerWithUser,
  deleteOnePartner,
  signUpThunk,
} from "@/entities";
import { useAppDispatch,formatPhoneInputMask, normalizePhoneDigits  } from "@/shared";

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

  const isDeletingText = (oldValue: string, newValue: string): boolean => {
    return newValue.length < oldValue.length;
  };

  const handleAddressAutocomplete = (value: string, currentValue: string): string => {
    const trimmedValue = value.trim();
    
    if (trimmedValue === "п" && !currentValue.includes("проспект")) {
      return "проспект ";
    }
    if (trimmedValue === "б" && !currentValue.includes("бульвар")) {
      return "бульвар ";
    }
    if (trimmedValue === "у" && !currentValue.includes("улица")) {
      return "улица ";
    }
    
    return value;
  };


  const [partnerInput, setPartnerInput] = useState<ICreatePartnerWithUser>(
    partner
      ? {
          login: partner.user.login,
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
        company_name: partner.company_name,
        inn: partner.inn,
        ogrn: partner.ogrn,
        address: partner.address,
        contact_person: partner.contact_person,
        contact_email: partner.contact_email,
        contact_phone: partner.contact_phone,
        comment: partner.comment,
        status: partner.status,
        login: partner.user.login,
        phone: partner.user.phone,
        role_id: partner.user.role_id,
      });
    }
  }, [partner]);

  const onChangePartnerHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    
    if (name === "phone" || name === "contact_phone") {
      const formatted = formatPhoneInputMask(value);
      setPartnerInput((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === "inn"){
      if (value.length > 12) {
        setPartnerInput((prev) => ({ ...prev, [name]: value.slice(0, 12) }));
        return;
      }
    }

     if (name === "ogrn"){
       if (value.length > 15) {
         setPartnerInput((prev) => ({ ...prev, [name]: value.slice(0, 15) }));
         return;
       }
     
     }

    if (name === "address") {
      const currentValue = partnerInput.address;
      
      if (value === "") {
        setPartnerInput((prev) => ({ ...prev, address: "" }));
        return;
      }
      
      if (isDeletingText(currentValue, value)) {
        setPartnerInput((prev) => ({ ...prev, address: value }));
        return;
      }
      
      const newAddressValue = handleAddressAutocomplete(value, currentValue);
      setPartnerInput((prev) => ({ ...prev, address: newAddressValue }));
      return;
    }


      setPartnerInput((prev) => ({
        ...prev,
        [name]: value,
      }));
  };

  const onSubmitPartnerHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      if (partner) {
        const normalizedContactPhone = normalizePhoneDigits(partnerInput.contact_phone);
        const partnerToUpdate = {
          company_name: partnerInput.company_name,
          inn: partnerInput.inn,
          ogrn: partnerInput.ogrn,
          address: partnerInput.address,
          contact_person: partnerInput.contact_person,
          contact_email: partnerInput.contact_email,
          contact_phone: normalizedContactPhone,
          comment: partnerInput.comment,
          status: partnerInput.status,
        };
        dispatch(
          updatePartnerThunk({ id: partner.id, partner: partnerToUpdate })
        );
      } else {
        const normalizedPhone = normalizePhoneDigits(partnerInput.phone);
        const signUpResult = await dispatch(
          signUpThunk({
            login: partnerInput.login,
            password: partnerInput.password || "",
            phone: normalizedPhone,
            role_id: partnerInput.role_id,
          })
        );
        
        // Проверяем, что регистрация прошла успешно
        if (signUpThunk.fulfilled.match(signUpResult) && signUpResult.payload.data.user) {
          const createdUser = signUpResult.payload.data.user;
          const normalizedContactPhone = normalizePhoneDigits(partnerInput.contact_phone);
          const partnerToCreate = {
            company_name: partnerInput.company_name,
            inn: partnerInput.inn,
            ogrn: partnerInput.ogrn,
            address: partnerInput.address,
            contact_person: partnerInput.contact_person,
            contact_email: partnerInput.contact_email,
            contact_phone: normalizedContactPhone,
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
      {!partner && (
        <div className={styles.formGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Введите пароль"
            value={partnerInput.password}
            onChange={onChangePartnerHandler}
            className={styles.formInput}
          />
        </div>
      )}
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
          placeholder="улица(проспект, бульвар), Номер дома, Город"
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
