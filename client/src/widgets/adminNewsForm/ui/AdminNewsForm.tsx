import styles from "./AdminNewsForm.module.css";
import {  
  updateNewsThunk,
  type IAdminNews,
  type ICreateAdminNews,
} from "@/entities";
import type { AppDispatch } from "@/app/store/store";

type AdminNewsFormProps = {
  news: IAdminNews;
  dispatch: AppDispatch;
  setEditOneNews: (value: boolean) => void;
  editOneNewsId: number;
  newsInput: ICreateAdminNews;
  setNewsInput: React.Dispatch<React.SetStateAction<ICreateAdminNews>>;
};

export function AdminNewsForm({
  news,
  dispatch,
  setEditOneNews,
  editOneNewsId,
  newsInput,
  setNewsInput,
}: AdminNewsFormProps) {
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
      dispatch(updateNewsThunk({ id: editOneNewsId, news: newsInput }));
    } catch (error) {
      console.error(error);
    } finally {
      setEditOneNews(false);
    }
  };
  return (
    <form
      key={news.id}
      className={styles.editForm}
      onSubmit={onSubmitNewsHandler}
    >
      <div className={styles.formGroup}>
        <input
          type="text"
          name="title"
          placeholder="Название"
          value={newsInput.title}
          onChange={onChangeNewsHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="description"
          placeholder="Описание"
          value={newsInput.description}
          onChange={onChangeNewsHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <input
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
          onClick={() => setEditOneNews(false)}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
