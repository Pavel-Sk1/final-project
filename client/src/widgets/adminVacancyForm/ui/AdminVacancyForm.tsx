import { useEffect, useState } from "react";
import styles from "./AdminVacancyForm.module.css";
import {
  createVacancyThunk,
  deleteOneVacancy,
  updateVacancyThunk,
  type IAdminVacancy,
  type ICreateAdminVacancy,
} from "@/entities";
import {
  useAppDispatch,
  useModalNotifications,
  SuccessModal,
  ErrorModal,
} from "@/shared";

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
  const {
    successModal,
    errorModal,
    showSuccess,
    showError,
    closeSuccess,
    closeError,
  } = useModalNotifications();
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

  const onSubmitVacancyHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      if (vacancy) {
        const result = await dispatch(
          updateVacancyThunk({ id: vacancy.id, vacancy: vacancyInput })
        );
        if (updateVacancyThunk.fulfilled.match(result)) {
          showSuccess("Вакансия обновлена", "Вакансия была успешно обновлена!");
        } else {
          showError(
            "Ошибка обновления",
            "Не удалось обновить вакансию. Попробуйте снова."
          );
        }
      } else {
        const result = await dispatch(createVacancyThunk(vacancyInput));
        if (createVacancyThunk.fulfilled.match(result)) {
          showSuccess("Вакансия создана", "Вакансия была успешно создана!");
        } else {
          showError(
            "Ошибка создания",
            "Не удалось создать вакансию. Попробуйте снова."
          );
        }
      }
    } catch (error) {
      console.error(error);
      showError("Ошибка", "Произошла неожиданная ошибка. Попробуйте снова.");
    }
  };

  // Функция для закрытия формы после успешной операции
  const handleCloseForm = () => {
    setVacancyInput(initialVacancyInput);
    setCreateVacancy?.(false);
    onClose?.();
    dispatch(deleteOneVacancy());
  };

  return (
    <>
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
            onClick={handleCloseForm}
          >
            Отмена
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => {
          closeSuccess();
          handleCloseForm();
        }}
        title={successModal.title}
        message={successModal.message}
        buttonText={successModal.buttonText}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeError}
        title={errorModal.title}
        message={errorModal.message}
        buttonText={errorModal.buttonText}
      />
    </>
  );
}
