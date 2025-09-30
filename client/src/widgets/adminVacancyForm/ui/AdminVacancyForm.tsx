import styles from "./AdminVacancyForm.module.css";
import {  
  updateVacancyThunk,
  type IAdminVacancy,
  type ICreateAdminVacancy,
} from "@/entities";
import type { AppDispatch } from "@/app/store/store";

type AdminVacancyFormProps = {
  vacancy: IAdminVacancy;
  dispatch: AppDispatch;
  setEditOneVacancy: (value: boolean) => void;
  editOneVacancyId: number;
  vacancyInput: ICreateAdminVacancy;
  setVacancyInput: React.Dispatch<React.SetStateAction<ICreateAdminVacancy>>;
};

export function AdminVacancyForm({
  vacancy,
  dispatch,
  setEditOneVacancy,
  editOneVacancyId,
  vacancyInput,
  setVacancyInput,
}: AdminVacancyFormProps) {
  const onChangeVacancyHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      dispatch(updateVacancyThunk({ id: editOneVacancyId, vacancy: vacancyInput }));
    } catch (error) {
      console.error(error);
    } finally {
      setEditOneVacancy(false);
    }
  };
  
  return (
    <form
      key={vacancy.id}
      className={styles.editForm}
      onSubmit={onSubmitVacancyHandler}
    >
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
          onClick={() => setEditOneVacancy(false)}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
