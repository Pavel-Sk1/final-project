import { useEffect } from "react";
import styles from "./AdminManageProductList.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllProductsThunk } from "@/entities/products";
import { AdminManageProductCard } from "@/widgets";

export function AdminManageProductList() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    try {
      dispatch(getAllProductsThunk());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return (
    <div className={styles.itemsContainer}>
      {products.map((product) => (
        <AdminManageProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
