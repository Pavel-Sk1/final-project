import { useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import styles from "./AdminManageEditProductModal.module.css";
import { useAppSelector } from "@/shared";
import { AdminManageProductForm } from "@/widgets/adminManageProductForm";

type AdminManageEditProductModalProps = {
    isOpen: boolean;
    onClose: () => void;    
}

export function AdminManageEditProductModal({ isOpen, onClose }: AdminManageEditProductModalProps) {
          const {product} = useAppSelector((state) => state.products);
    const handleEscape = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "auto";
        }
    }, [isOpen, handleEscape]);

    const handleClickOutside = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const modalContent = useMemo(() => {        
        return (
            <AdminManageProductForm
                product={product}
                onClose={onClose}
                setProCreateProduct={null}                
            />
        );
    }, [product, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <section className={styles.backdrop} onClick={handleClickOutside}>
            {modalContent}
        </section>,
        document.body
    );
}