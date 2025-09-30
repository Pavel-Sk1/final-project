import { createVacancyThunk, type ICreateAdminVacancy } from "@/entities";
import { useState } from "react";
import styles from "./AdminCreateVacancyForm.module.css";
import { useAppDispatch } from "@/shared";

type AdminCreateVacancyFormProps = {
  setCreateVacancy: (value: boolean) => void;
};

export function AdminCreateVacancyForm({
  setCreateVacancy,
}: AdminCreateVacancyFormProps) {
  const dispatch = useAppDispatch();
  const [vacancyInput, setVacancyInput] = useState<ICreateAdminVacancy>({
    position: "",
    location: "",
    salary: "",
    description: "",
    is_active: false,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setVacancyInput((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeIsActiveHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVacancyInput((prev) => ({ ...prev, is_active: event.target.checked }));
  };

  const isValid = () => {
    if (!vacancyInput.position.trim()) return false;
    if (!vacancyInput.location.trim()) return false;
    if (!vacancyInput.salary.trim()) return false;
    if (!vacancyInput.description.trim()) return false;
    return true;
  };

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
    return "Ошибка при создании вакансии";
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    if (!isValid()) {
      setErrorMsg("Заполните все поля перед сохранением");
      return;
    }

    const payload: ICreateAdminVacancy = {
      position: vacancyInput.position.trim(),
      location: vacancyInput.location.trim(),
      salary: vacancyInput.salary.trim(),
      description: vacancyInput.description.trim(),
      is_active: vacancyInput.is_active,
    };

    setIsSubmitting(true);
    try {
      await dispatch(createVacancyThunk(payload)).unwrap();
      setVacancyInput({
        position: "",
        location: "",
        salary: "",
        description: "",
        is_active: false,
      });
      setCreateVacancy(false);
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.editForm} onSubmit={onSubmitHandler}>
      {errorMsg && (
        <div
          style={{
            padding: "0.75rem 1rem",
            border: "1px solid var(--error, #ef4444)",
            borderRadius: "6px",
            color: "#ef4444",
            background: "#fef2f2",
          }}
        >
          {errorMsg}
        </div>
      )}
      <div className={styles.formGroup}>
        <input
          type="text"
          name="position"
          placeholder="Должность"
          value={vacancyInput.position}
          onChange={onChangeHandler}
          className={styles.formInput}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="location"
          placeholder="Местоположение"
          value={vacancyInput.location}
          onChange={onChangeHandler}
          className={styles.formInput}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="salary"
          placeholder="Зарплата"
          value={vacancyInput.salary}
          onChange={onChangeHandler}
          className={styles.formInput}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          name="description"
          placeholder="Описание вакансии"
          value={vacancyInput.description}
          onChange={onChangeHandler}
          className={styles.formTextarea}
          rows={4}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.checkboxGroup}>
          <input
            id="is_active"
            type="checkbox"
            name="is_active"
            checked={vacancyInput.is_active}
            onChange={onChangeIsActiveHandler}
            className={styles.formInput}
          />
          <label htmlFor="is_active">Показывать/скрыть на сайте</label>
        </div>
      </div>
      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => setCreateVacancy(false)}
          disabled={isSubmitting}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
