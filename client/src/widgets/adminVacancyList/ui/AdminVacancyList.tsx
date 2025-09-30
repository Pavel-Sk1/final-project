import { useEffect } from "react";
import styles from "./AdminVacancyList.module.css";
import { getAllAdminVacanciesThunk } from "@/entities";
import { useAppDispatch, useAppSelector } from "@/shared";
import { AdminVacancyCard } from "../../adminVacancyCard";

export function AdminVacancyList() {  
  const { vacancyArray } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllAdminVacanciesThunk());
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {vacancyArray.map((vacancy) => (
        <AdminVacancyCard key={vacancy.id} vacancy={vacancy} />
      ))}
    </div>
  );
}
