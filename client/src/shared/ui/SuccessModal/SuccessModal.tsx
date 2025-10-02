import { useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import styles from "./SuccessModal.module.css";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Отлично",
}: SuccessModalProps) {
  // Мемоизированный обработчик Escape
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  // Закрытие по Escape
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Блокируем скролл body при открытом модальном окне
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  // Мемоизированный обработчик клика по backdrop
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Мемоизированный контент модального окна
  const modalContent = useMemo(
    () => (
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <svg
              className={styles.successIcon}
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" className={styles.successCircle} />
              <path d="m9 12 2 2 4-4" className={styles.successCheck} />
            </svg>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.successButton}>
            {buttonText}
          </button>
        </div>
      </div>
    ),
    [title, message, buttonText, onClose]
  );

  if (!isOpen) return null;

  // Рендерим модальное окно в корне документа через Portal
  return createPortal(
    <section className={styles.backdrop} onClick={handleBackdropClick}>
      {modalContent}
    </section>,
    document.body
  );
}
