import { useEffect, useState } from "react";
import styles from "./AdminNewsForm.module.css";
import {
  createNewsThunk,
  updateNewsThunk,
  type IAdminNews,
  type ICreateAdminNews,
  deleteOneNews,
} from "@/entities";
import {
  useAppDispatch,
  useModalNotifications,
  SuccessModal,
  ErrorModal,
  ImageUpload,
} from "@/shared";

const initialNewsInput: ICreateAdminNews = {
  title: "",
  description: "",
  img: "",
  is_active: false,
};

type AdminNewsFormProps = {
  setCreateNews: React.Dispatch<React.SetStateAction<boolean>> | null;
  news: IAdminNews | null;
  onClose: (() => void) | null;
};

export function AdminNewsForm({
  setCreateNews = null,
  news = null,
  onClose = null,
}: AdminNewsFormProps) {
  const dispatch = useAppDispatch();
  const {
    successModal,
    errorModal,
    showSuccess,
    showError,
    closeSuccess,
    closeError,
  } = useModalNotifications();
  const [newsInput, setNewsInput] = useState<ICreateAdminNews | IAdminNews>(
    news
      ? {
          title: news.title,
          description: news.description,
          img: news.img,
          is_active: news.is_active,
        }
      : initialNewsInput
  );

  useEffect(() => {
    if (news) {
      setNewsInput({
        title: news.title,
        description: news.description,
        img: news.img,
        is_active: news.is_active,
      });
    }
  }, [news]);

  const onChangeNewsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewsInput((prev: ICreateAdminNews) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onChangeNewsIsActiveHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewsInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const onSubmitNewsHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      if (news) {
        const result = await dispatch(
          updateNewsThunk({ id: news.id, news: newsInput })
        );
        if (updateNewsThunk.fulfilled.match(result)) {
          showSuccess("Новость обновлена", "Новость была успешно обновлена!");
        } else {
          showError(
            "Ошибка обновления",
            "Не удалось обновить новость. Попробуйте снова."
          );
        }
      } else {
        const result = await dispatch(createNewsThunk(newsInput));
        if (createNewsThunk.fulfilled.match(result)) {
          showSuccess("Новость создана", "Новость была успешно создана!");
        } else {
          showError(
            "Ошибка создания",
            "Не удалось создать новость. Попробуйте снова."
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
    setNewsInput(initialNewsInput);
    setCreateNews?.(false);
    onClose?.();
    dispatch(deleteOneNews());
  };

  return (
    <>
      <form className={styles.editForm} onSubmit={onSubmitNewsHandler}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Название</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Название"
            value={newsInput.title}
            onChange={onChangeNewsHandler}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Описание"
            value={newsInput.description}
            onChange={onChangeNewsHandler}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="img">Изображение новости</label>
          <ImageUpload
            currentImageUrl={newsInput.img}
            onImageChange={(url) =>
              setNewsInput((prev) => ({ ...prev, img: url }))
            }
            onImageClear={() => setNewsInput((prev) => ({ ...prev, img: "" }))}
            placeholder="Введите URL изображения или загрузите файл"
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={newsInput.is_active}
              onChange={onChangeNewsIsActiveHandler}
            />
            <label htmlFor="is_active">Активность новости</label>
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
