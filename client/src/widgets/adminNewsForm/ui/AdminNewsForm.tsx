import { useEffect, useState } from "react";
import styles from "./AdminNewsForm.module.css";
import {
  createNewsThunk,
  updateNewsThunk,
  type IAdminNews,
  type ICreateAdminNews,
  deleteOneNews,
} from "@/entities";
import { useAppDispatch } from "@/shared";

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

  const onSubmitNewsHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (news) {
        dispatch(updateNewsThunk({ id: news.id, news: newsInput }));
      } else {
        dispatch(createNewsThunk(newsInput));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setNewsInput(initialNewsInput);
      setCreateNews?.(false);
      onClose?.();
      dispatch(deleteOneNews());
    }
  };
  return (
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
        <label htmlFor="img">URL изображения</label>
        <input
          id="img"
          type="text"
          name="img"
          placeholder="URL изображения"
          value={newsInput.img}
          onChange={onChangeNewsHandler}
          className={styles.formInput}
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
          onClick={() => {
            setCreateNews?.(false);
            onClose?.();
            dispatch(deleteOneNews());
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
