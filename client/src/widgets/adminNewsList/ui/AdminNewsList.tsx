import { useEffect, useState } from "react";
import styles from "./AdminNewsList.module.css";
import { getAllAdminNewsThunk } from "@/entities";
import { useAppDispatch, useAppSelector } from "@/shared";
import { AdminNewsForm } from "@/widgets/adminNewsForm";
import { AdminNewsCard } from "@/widgets/adminNewsCard";

export function AdminNewsList() {
  const [editOneNews, setEditOneNews] = useState(false);
  const [editOneNewsId, setEditOneNewsId] = useState(0);
  const [newsInput, setNewsInput] = useState({
    title: "",
    description: "",
    img: "",
    is_active: false,
  });
  const { newsArray } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllAdminNewsThunk());
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {newsArray.map((news) =>
        editOneNews && editOneNewsId === news.id ? (
          <AdminNewsForm
            key={news.id}
            news={news}
            dispatch={dispatch}
            setEditOneNews={setEditOneNews}
            editOneNewsId={editOneNewsId}
            newsInput={newsInput}
            setNewsInput={setNewsInput}
          />
        ) : (
          <AdminNewsCard
            key={news.id}
            news={news}
            setEditOneNews={setEditOneNews}
            setEditOneNewsId={setEditOneNewsId}
            setNewsInput={setNewsInput}
          />
        )
      )}
    </div>
  );
}
