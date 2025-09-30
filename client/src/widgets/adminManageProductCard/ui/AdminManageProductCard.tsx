import { useMemo, useState } from "react";
import styles from "./AdminManageProductCard.module.css";
import { useAppDispatch, EditModal } from "@/shared";
import type { IProduct } from "@/entities/products";
import { deleteProductThunk, editOneProduct } from "@/entities";
import { AdminManageProductForm } from "@/widgets";


type AdminManageProductCardProps = {
  product: IProduct;  
};

export function AdminManageProductCard({
  product,  
}: AdminManageProductCardProps) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const memoizedProductForm = useMemo(() => {
    return (
      <AdminManageProductForm
        product={product}
        onClose={() => setIsOpen(false)}
        setProCreateProduct={null}
      />
    )
  }, [product, setIsOpen])
  const deleteProductHandler = () => {
    try {
      dispatch(deleteProductThunk(product.id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.productItem}>
      <div className={styles.itemImage}>
        <img src={product.img} alt={product.name} />
      </div>
      <div className={styles.itemContent}>
        <h3 className={styles.itemTitle}>{product.name}</h3>
        <p className={styles.itemDescription}>{product.price}</p>
        <p className={styles.itemDescription}>{product.recipe}</p>
        <p className={styles.itemDescription}>{product.weight}</p>
        <p
          className={`${styles.itemDescription} ${
            product.is_active ? styles.statusActive : styles.statusInactive
          }`}
        >
          {product.is_active ? "Активен" : "Неактивен"}
        </p>
        {product.variants && product.variants.length > 0 && (
          <div className={styles.variantsContainer}>
            {product.variants.map((variant, index) => (
              <span key={index} className={styles.variantTag}>
                {variant}
              </span>
            ))}
          </div>
        )}
        {product.variant_names && product.variant_names.length > 0 && (
          <div className={styles.variantsContainer}>
            {product.variant_names.map((variantName, index) => (
              <span key={index} className={styles.variantTag}>
                {variantName}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={styles.itemActions}>
        <button
          className={styles.editButton}
          onClick={() => {            
            dispatch(editOneProduct(product));
            setIsOpen(true);
          }}
        >
          Редактировать
        </button>
        <button className={styles.deleteButton} onClick={deleteProductHandler}>
          Удалить
        </button>
      </div>
      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        memoizedContent={memoizedProductForm}
      />
    </div>
  );
}
