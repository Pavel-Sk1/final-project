import {
  deleteVacancyThunk,
  type IAdminVacancy,
  type ICreateAdminVacancy,
} from "@/entities";
import styles from "./AdminVacancyCard.module.css";
import { useAppDispatch } from "@/shared";

type AdminVacancyCardProps = {
  vacancy: IAdminVacancy;
  setEditOneVacancy: (value: boolean) => void;
  setEditOneVacancyId: (value: number) => void;
  setVacancyInput: React.Dispatch<React.SetStateAction<ICreateAdminVacancy>>;
};

export function AdminVacancyCard({
  vacancy,
  setEditOneVacancy,
  setEditOneVacancyId,
  setVacancyInput,
}: AdminVacancyCardProps) {
  const dispatch = useAppDispatch();
  const deleteVacancyHandler = () => {
    try {
      dispatch(deleteVacancyThunk(vacancy.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div key={vacancy.id} className={styles.vacancyItem}>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{vacancy.position}</h3>
        <p className={styles.itemLocation}>{vacancy.location}</p>
        <p className={styles.itemSalary}>{vacancy.salary}</p>
        <p className={styles.itemDescription}>{vacancy.description}</p>
        <div className={styles.itemStatus}>
          <span className={vacancy.is_active ? styles.statusActive : styles.statusInactive}>
            {vacancy.is_active ? 'Активна' : 'Неактивна'}
          </span>
        </div>
      </div>
      <div className={styles.itemActions}>
        <button
          className={styles.editButton}
          onClick={() => {
            setEditOneVacancy(true);
            setEditOneVacancyId(vacancy.id);
            setVacancyInput({
              position: vacancy.position,
              location: vacancy.location,
              salary: vacancy.salary,
              description: vacancy.description,
              is_active: vacancy.is_active,
            });
          }}
        >
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={deleteVacancyHandler}>
          Удалить
        </button>
      </div>
    </div>
  );
}
