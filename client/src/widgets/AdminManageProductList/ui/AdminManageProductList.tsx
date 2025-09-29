import { useEffect, useState } from "react";
import styles from "./AdminManageProductList.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllProductsThunk } from "@/entities/products";
import { AdminManageProductForm, AdminManageProductCard} from "@/widgets";

export function AdminManageProductList() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  const [proEditOneProduct, setProEditOneProduct] = useState(false);
  const [proEditOneProductId, setProEditOneProductId] = useState(0);

  useEffect(() => {
    try {
      dispatch(getAllProductsThunk());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {products.map((product) =>
        proEditOneProduct && proEditOneProductId === product.id ? (
          <AdminManageProductForm
            key={product.id}
            product={product}
            setProCreateProduct={null}
            setProEditOneProduct={setProEditOneProduct}
          />
        ) : (
          <AdminManageProductCard
            key={product.id}
            product={product}
            setProEditOneProduct={setProEditOneProduct}
            setProEditOneProductId={setProEditOneProductId}
          />
        )
      )}
    </div>
  );
}
