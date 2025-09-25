import { createNewsThunk, type ICreateAdminNews } from "@/entities";
import { useState } from "react"
import styles from "./AdminCreateNewsForm.module.css";
import { useAppDispatch } from "@/shared";

type AdminCreateNewsFormProps = {
    setCreateNews: (value: boolean) => void;
}

export function AdminCreateNewsForm({ setCreateNews }: AdminCreateNewsFormProps) {
    const dispatch = useAppDispatch();
    const [newsInput, setNewsInput] = useState({
        title: "",
        description: "",
        img: "",
        is_active: false,
    });

    const onChangeNewsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewsInput((prev: ICreateAdminNews) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };
    const onChangeNewsIsActiveHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewsInput((prev) => ({
            ...prev,
            [event.target.name]: event.target.checked,
        }));
    };
    const onSubmitNewsHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            dispatch(createNewsThunk(newsInput));
        } catch (error) {
            console.error(error);
        } finally {
            setNewsInput({
                title: "",
                description: "",
                img: "",
                is_active: false,
            });
            setCreateNews(false);
        }
    };

  return (
    <form      
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
        <label htmlFor="is_active">Показывать/скрыть на сайте</label>
        <input
          id="is_active"
          type="checkbox"
          name="is_active"
          placeholder="Активность"
          checked={newsInput.is_active}
          onChange={onChangeNewsIsActiveHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>
          Сохранить
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => setCreateNews(false)}
        >
          Отмена
        </button>
      </div>
    </form>
  )
}