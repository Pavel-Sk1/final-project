import { useEffect, useState } from "react";
import styles from "./AdminVacancyForm.module.css";
import {
  createVacancyThunk,
  deleteOneVacancy,
  updateVacancyThunk,
  type IAdminVacancy,
  type ICreateAdminVacancy,
} from "@/entities";
import { useAppDispatch } from "@/shared";

const initialVacancyInput: ICreateAdminVacancy = {
  position: "",
  location: "",
  salary: "",
  description: "",
  is_active: false,
};

type AdminVacancyFormProps = {
  setCreateVacancy: React.Dispatch<React.SetStateAction<boolean>> | null;
  vacancy: IAdminVacancy | null;
  onClose: (() => void) | null;
};

export function AdminVacancyForm({
  setCreateVacancy = null,
  vacancy,
  onClose = null,
}: AdminVacancyFormProps) {
  const dispatch = useAppDispatch();
  const [vacancyInput, setVacancyInput] = useState<ICreateAdminVacancy>(
    vacancy
      ? {
          position: vacancy.position,
          location: vacancy.location,
          salary: vacancy.salary,
          description: vacancy.description,
          is_active: vacancy.is_active,
        }
      : initialVacancyInput
  );

  useEffect(() => {
    if (vacancy) {
      setVacancyInput({
        position: vacancy.position,
        location: vacancy.location,
        salary: vacancy.salary,
        description: vacancy.description,
        is_active: vacancy.is_active,
      });
    }
  }, [vacancy]);

  const onChangeVacancyHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setVacancyInput((prev: ICreateAdminVacancy) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onChangeVacancyIsActiveHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVacancyInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const onSubmitVacancyHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (vacancy) {
        dispatch(updateVacancyThunk({ id: vacancy.id, vacancy: vacancyInput }));
      } else {
        dispatch(createVacancyThunk(vacancyInput));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setVacancyInput(initialVacancyInput);
      setCreateVacancy?.(false);
      onClose?.();
      dispatch(deleteOneVacancy());
    }
  };

  return (
    <form className={styles.editForm} onSubmit={onSubmitVacancyHandler}>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="position"
          placeholder="Должность"
          value={vacancyInput.position}
          onChange={onChangeVacancyHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="location"
          placeholder="Местоположение"
          value={vacancyInput.location}
          onChange={onChangeVacancyHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="salary"
          placeholder="Зарплата"
          value={vacancyInput.salary}
          onChange={onChangeVacancyHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          name="description"
          placeholder="Описание вакансии"
          value={vacancyInput.description}
          onChange={onChangeVacancyHandler}
          className={styles.formTextarea}
          rows={4}
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={vacancyInput.is_active}
            onChange={onChangeVacancyIsActiveHandler}
          />
          <label htmlFor="is_active">Активность вакансии</label>
        </div>
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>
          Сохранить
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => {
            setCreateVacancy?.(false);
            onClose?.();
            dispatch(deleteOneVacancy());
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
