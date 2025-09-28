import { useEffect, useState } from "react";
import styles from "./AdminManageProductList.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllProductsThunk } from "@/entities/products";

export function AdminManageProductList() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  const [editOneProduct, setEditOneProduct] = useState(false);
  const [editOneProductId, setEditOneProductId] = useState(0);  

  useEffect(() => {
    try {
      dispatch(getAllProductsThunk());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return <div>AdminManageProductList</div>;
}
