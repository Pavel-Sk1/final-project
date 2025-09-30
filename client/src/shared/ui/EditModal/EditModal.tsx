import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./EditModal.module.css";


type AdminManageEditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  memoizedContent: React.ReactNode;
};

export function EditModal({
  isOpen,
  onClose,
  memoizedContent,
}: AdminManageEditProductModalProps) {
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, handleEscape]);

  const handleClickOutside = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return createPortal(
    <section className={styles.backdrop} onClick={handleClickOutside}>
      {memoizedContent}
    </section>,
    document.body
  );
}