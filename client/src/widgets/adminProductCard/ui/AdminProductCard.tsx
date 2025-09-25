import type { IAdminProduct, ICreateAdminProduct } from "@/entities";
import styles from "./AdminProductCard.module.css";

type AdminProductCardProps = {
  product: IAdminProduct;
  setEditOneProduct: (value: boolean) => void;
  setEditOneProductId: (value: number) => void;
  setProductInput: React.Dispatch<React.SetStateAction<ICreateAdminProduct>>;
};
export function AdminProductCard({ product, setEditOneProduct, setEditOneProductId, setProductInput }: AdminProductCardProps) {
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
          setEditOneProduct(true);
          setEditOneProductId(product.id);
          setProductInput({ img: product.img });
        }}
      >
        Редактировать
      </button>
    </div>
  );
}
