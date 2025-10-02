import { useEffect, useState } from 'react';
import styles from './vacancyPage.module.css';
import { useAppDispatch, useAppSelector, usePageTitle } from '@/shared';
import { getAllVacanciesThunk, type IVacancy, getAllContactsThunk, type MainContact } from '@/entities';
import { formatPhonePretty, formatTelHref } from '@/shared/lib/phone';

export function VacancyPage() {
  const { loading, error, list } = useAppSelector((state) => state.vacancy);
  const { contacts } = useAppSelector((state) => state.contact);
  const dispatch = useAppDispatch();
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
  const [selectedVacancy, setSelectedVacancy] = useState<IVacancy | null>(null);

  usePageTitle("Вакансии");

  useEffect(() => {
    dispatch(getAllVacanciesThunk());
    dispatch(getAllContactsThunk());
  }, [dispatch]);

  const toggleLocation = (location: string) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(location)) {
      newExpanded.delete(location);
    } else {
      newExpanded.add(location);
    }
    setExpandedLocations(newExpanded);
  };

  const openModal = (vacancy: IVacancy) => {
    setSelectedVacancy(vacancy);
  };

  const closeModal = () => {
    setSelectedVacancy(null);
  };

  const groupedVacancies = list.reduce((acc, vacancy) => {
    if (!acc[vacancy.location]) {
      acc[vacancy.location] = [];
    }
    acc[vacancy.location].push(vacancy);
    return acc;
  }, {} as Record<string, IVacancy[]>);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Приглашаем на работу:</h1>
        
        <div className={styles.vacanciesContainer}>
          {Object.entries(groupedVacancies).map(([location, vacancies]) => (
            <div key={location} className={styles.locationGroup}>
              <button 
                className={styles.locationButton}
                onClick={() => toggleLocation(location)}
              >
                <span className={styles.locationName}>{location}</span>
                <span className={`${styles.arrow} ${expandedLocations.has(location) ? styles.arrowOpen : ''}`}>
                  ▼
                </span>
              </button>
              
              {expandedLocations.has(location) && (
                <div className={styles.vacanciesList}>
                  {vacancies.map((vacancy) => (
                    <button
                      key={vacancy.id}
                      className={styles.vacancyItem}
                      onClick={() => openModal(vacancy)}
                    >
                      <div className={styles.vacancyInfo}>
                        <h3 className={styles.position}>{vacancy.position}</h3>
                        <p className={styles.salary}>{vacancy.salary}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 className={styles.subtitlecontacts}>Наши контакты:</h2>
        <div className={styles.contacts}>
          {contacts && contacts.length > 0 ? (
            contacts.map((c: MainContact) => (
              <div key={c.id}>
                <p>
                  Телефон: <a href={formatTelHref(c.phone as unknown as string)}>{formatPhonePretty(c.phone as unknown as string)}</a>
                </p>
                <p>
                  Email: <a href={`mailto:${c.email}`}>{c.email}</a>
                </p>
                <p>Адрес: {c.address}</p>
                <p>Telegram: <a href={c.telegram} target="_blank" rel="noreferrer">{c.telegram.replace('https://t.me/', '@')}</a></p>
              </div>
            ))
          ) : (
            <p>Контакты не найдены</p>
          )}
        </div>
      </div>

      {selectedVacancy && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <h2 className={styles.modalTitle}>{selectedVacancy.position}</h2>
            <div className={styles.modalContent}>
              <div className={styles.modalField}>
                <strong>Локация:</strong> {selectedVacancy.location}
              </div>
              <div className={styles.modalField}>
                <strong>Заработная плата:</strong> {selectedVacancy.salary}
              </div>
              <div className={styles.modalField}>
                <strong>Описание:</strong>
                <p className={styles.description}>{selectedVacancy.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
