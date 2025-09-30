import { useEffect } from "react";
import styles from "./AdminNewsList.module.css";
import { getAllAdminNewsThunk } from "@/entities";
import { useAppDispatch, useAppSelector } from "@/shared";
import { AdminNewsCard } from "@/widgets/adminNewsCard";

export function AdminNewsList() {
  const dispatch = useAppDispatch();
  const { newsArray } = useAppSelector((state) => state.admin);

  useEffect(() => {
    try {
      dispatch(getAllAdminNewsThunk());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {newsArray.map((news) => (
        <AdminNewsCard key={news.id} news={news} />
      ))}
    </div>
  );
}
