import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllProductsThunk } from "@/entities";
import styles from "./AdminProductList.module.css";
import { AdminProductCard } from "@/widgets/adminProductCard";

export function AdminProductList() {
  
  const { productArray } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllProductsThunk());
  }, [dispatch]);
  return (
    <div className={styles.itemsContainer}>
      {productArray.map((product) => (
        <AdminProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
