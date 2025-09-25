import type { IAdminNews, ICreateAdminNews } from "@/entities";
import styles from "./AdminNewsCard.module.css";

type AdminNewsCardProps = {
  news: IAdminNews;
  setEditOneNews: (value: boolean) => void;
  setEditOneNewsId: (value: number) => void;
  setNewsInput: React.Dispatch<React.SetStateAction<ICreateAdminNews>>;
};

export function AdminNewsCard( { news, setEditOneNews, setEditOneNewsId, setNewsInput }: AdminNewsCardProps ) {
  return (
    <div key={news.id} className={styles.newsItem}>
            <div className={styles.itemImage}>
              <img src={news.img} alt={news.title} />
            </div>
            <div className={styles.itemContent}>
              <h3 className={styles.itemTitle}>{news.title}</h3>
              <p className={styles.itemDescription}>{news.description}</p>
            </div>
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
          </div>
  )
}