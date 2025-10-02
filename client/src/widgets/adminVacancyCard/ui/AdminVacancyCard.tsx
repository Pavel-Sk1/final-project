import { useMemo, useState } from "react";
import {
  deleteVacancyThunk,
  editOneVacancy,
  type IAdminVacancy,  
} from "@/entities";
import styles from "./AdminVacancyCard.module.css";
import { useAppDispatch, EditModal, ConfirmationModal } from "@/shared";
import { AdminVacancyForm } from "@/widgets/adminVacancyForm";

type AdminVacancyCardProps = {
  vacancy: IAdminVacancy;  
};

export function AdminVacancyCard({
  vacancy,  
}: AdminVacancyCardProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const memoizedVacancyForm = useMemo(() => {
    return (
      <AdminVacancyForm
        vacancy={vacancy}
        onClose={() => setIsOpen(false)}
        setCreateVacancy={null}
      />
    )
  }, [vacancy, setIsOpen])
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  }
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  }
  const deleteVacancyHandler = () => {
    try {
      dispatch(deleteVacancyThunk(vacancy.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div key={vacancy.id} className={styles.vacancyItem}>
      <div className={styles.itemStatus}>
        <span className={vacancy.is_active ? styles.statusActive : styles.statusInactive}>
          {vacancy.is_active ? 'Активна' : 'Неактивна'}
        </span>
      </div>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{vacancy.position}</h3>
        <p className={styles.itemLocation}>{vacancy.location}</p>
        <p className={styles.itemSalary}>{vacancy.salary}</p>
        <p className={styles.itemDescription}>{vacancy.description}</p>
      </div>
      <div className={styles.itemActions}>
        <button
          className={styles.editButton}
          onClick={() => {
            dispatch(editOneVacancy(vacancy));
            setIsOpen(true);
          }}
        >
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>
          Удалить
        </button>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={deleteVacancyHandler}
        title="Удалить вакансию"
        message="Вы уверены, что хотите удалить эту вакансию?"
      />
      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        memoizedContent={memoizedVacancyForm}
      />
    </div>
  );
}
