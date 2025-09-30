import { useMemo, useState } from "react";
import styles from "./AdminNewsCard.module.css";
import { useAppDispatch, EditModal } from "@/shared";
import { deleteNewsThunk, editOneNews, type IAdminNews } from "@/entities";
import { AdminNewsForm } from "@/widgets/adminNewsForm";

type AdminNewsCardProps = {
  news: IAdminNews;
};

export function AdminNewsCard({ news }: AdminNewsCardProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const memoizedNewsForm = useMemo(() => {
    return (
      <AdminNewsForm
        news={news}
        onClose={() => setIsOpen(false)}
        setCreateNews={null}
      />
    );
  }, [news, setIsOpen]);
  const deleteNewsHandler = () => {
    try {
      dispatch(deleteNewsThunk(news.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div key={news.id} className={styles.newsItem}>
      <div className={styles.itemStatus}>
        <span className={news.is_active ? styles.statusActive : styles.statusInactive}>
          {news.is_active ? 'Активна' : 'Неактивна'}
        </span>
      </div>
      <div className={styles.itemImage}>
        <img src={news.img} alt={news.title} />
      </div>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{news.title}</h3>
        <p className={styles.itemDescription}>{news.description}</p>
      </div>
      <div className={styles.itemActions}>
        <button
          className={styles.editButton}
          onClick={() => {
            dispatch(editOneNews(news));
            setIsOpen(true);
          }}
        >
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={deleteNewsHandler}>
          Удалить
        </button>
      </div>
      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        memoizedContent={memoizedNewsForm}
      />
    </div>
  );
}
