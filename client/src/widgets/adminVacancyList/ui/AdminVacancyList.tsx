import { useEffect, useState } from "react";
import styles from "./AdminVacancyList.module.css";
import { getAllAdminVacanciesThunk } from "@/entities";
import { useAppDispatch, useAppSelector } from "@/shared";
import { AdminVacancyForm } from "../../adminVacancyForm";
import { AdminVacancyCard } from "../../adminVacancyCard";

export function AdminVacancyList() {
  const [editOneVacancy, setEditOneVacancy] = useState(false);
  const [editOneVacancyId, setEditOneVacancyId] = useState(0);
  const [vacancyInput, setVacancyInput] = useState({
    position: "",
    location: "",
    salary: "",
    description: "",
    is_active: false,
  });
  const { vacancyArray } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllAdminVacanciesThunk());
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {vacancyArray.map((vacancy) =>
        editOneVacancy && editOneVacancyId === vacancy.id ? (
          <AdminVacancyForm
            key={vacancy.id}
            vacancy={vacancy}
            dispatch={dispatch}
            setEditOneVacancy={setEditOneVacancy}
            editOneVacancyId={editOneVacancyId}
            vacancyInput={vacancyInput}
            setVacancyInput={setVacancyInput}
          />
        ) : (
          <AdminVacancyCard
            key={vacancy.id}
            vacancy={vacancy}
            setEditOneVacancy={setEditOneVacancy}
            setEditOneVacancyId={setEditOneVacancyId}
            setVacancyInput={setVacancyInput}
          />
        )
      )}
    </div>
  );
}
