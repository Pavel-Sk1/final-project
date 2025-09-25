import {
  deleteNewsThunk,
  type IAdminNews,
  type ICreateAdminNews,
} from "@/entities";
import styles from "./AdminNewsCard.module.css";
import { useAppDispatch } from "@/shared";

type AdminNewsCardProps = {
  news: IAdminNews;
  setEditOneNews: (value: boolean) => void;
  setEditOneNewsId: (value: number) => void;
  setNewsInput: React.Dispatch<React.SetStateAction<ICreateAdminNews>>;
};

export function AdminNewsCard({
  news,
  setEditOneNews,
  setEditOneNewsId,
  setNewsInput,
}: AdminNewsCardProps) {
  const dispatch = useAppDispatch();
  const deleteNewsHandler = () => {
    try {
      dispatch(deleteNewsThunk(news.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div key={news.id} className={styles.newsItem}>
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
            setEditOneNews(true);
            setEditOneNewsId(news.id);
            setNewsInput({
              title: news.title,
              description: news.description,
              img: news.img,
              is_active: news.is_active,
            });
          }}
        >
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={deleteNewsHandler}>
          Удалить
        </button>
      </div>
    </div>
  );
}
