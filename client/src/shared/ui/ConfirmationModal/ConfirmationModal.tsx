import { useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isLoading = false,
}: ConfirmationModalProps) {
    // Мемоизированный обработчик Escape
    const handleEscape = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
            onClose();
        }
    }, [isOpen, onClose]);

    // Закрытие по Escape
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Блокируем скролл body при открытом модальном окне
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    // Мемоизированный обработчик клика по backdrop
    const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }, [onClose]);

    // Мемоизированный контент модального окна
    const modalContent = useMemo(() => (
        <div className={styles.modal}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    disabled={isLoading}
                    aria-label="Close modal"
                >
                    ×
                </button>
            </div>

            <div className={styles.content}>
                <p className={styles.message}>{message}</p>
            </div>

            <div className={styles.footer}>
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className={styles.cancelButton}
                >
                    {cancelText}
                </button>
                <button                    
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={styles.confirmButton}
                >
                    {isLoading ? 'Deleting...' : confirmText}
                </button>
            </div>
        </div>
    ), [title, message, confirmText, cancelText, isLoading, onClose, onConfirm]);

    if (!isOpen) return null;

    // Рендерим модальное окно в корне документа через Portal
    return createPortal(
        <section className={styles.backdrop} onClick={handleBackdropClick}>
            {modalContent}
        </section>,
        document.body
    );
}
