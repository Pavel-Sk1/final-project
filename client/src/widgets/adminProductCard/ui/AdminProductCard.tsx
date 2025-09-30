import { editOneProduct, type IAdminProduct } from "@/entities";
import styles from "./AdminProductCard.module.css";
import { EditModal, useAppDispatch } from "@/shared";
import { useMemo, useState } from "react";
import { AdminProductForm } from "@/widgets/adminProductForm";

type AdminProductCardProps = {
  product: IAdminProduct;  
};
export function AdminProductCard({ product }: AdminProductCardProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const memoizedProductForm = useMemo(() => {
    return (
      <AdminProductForm
        product={product}
        onClose={() => setIsOpen(false)}
      />
    )
  }, [product, setIsOpen])
  return (
    <div key={product.id} className={styles.productItem}>
      <div className={styles.itemImage}>
        <img src={product.img} alt={product.name} />
      </div>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{product.name}</h3>
      </div>
      <button
        className={styles.editButton}
        onClick={() => {
          dispatch(editOneProduct(product));
          setIsOpen(true);
        }}
      >
        Редактировать
      </button>
      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        memoizedContent={memoizedProductForm}
      />
    </div>
  );
}
