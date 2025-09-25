import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllProductsThunk } from "@/entities";
import styles from "./AdminProductList.module.css";
import { AdminProductForm } from "@/widgets/adminProductForm";
import { AdminProductCard } from "@/widgets/adminProductCard";

export function AdminProductList() {
  const [editOneProduct, setEditOneProduct] = useState(false);
  const [editOneProductId, setEditOneProductId] = useState(0);
  const [productInput, setProductInput] = useState({
    img: "",
  });
  const { productArray } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllProductsThunk());
  }, [dispatch]);
  return (
    <div className={styles.itemsContainer}>
      {productArray.map((product) =>
        editOneProduct && editOneProductId === product.id ? (
          <AdminProductForm
            key={product.id}
            product={product}
            dispatch={dispatch}
            setEditOneProduct={setEditOneProduct}
            editOneProductId={editOneProductId}            
            productInput={productInput}
            setProductInput={setProductInput}
          />
        ) : (
          <AdminProductCard
            key={product.id}
            product={product}
            setEditOneProduct={setEditOneProduct}
            setEditOneProductId={setEditOneProductId}
            setProductInput={setProductInput}
          />
        )
      )}
    </div>
  );
}
