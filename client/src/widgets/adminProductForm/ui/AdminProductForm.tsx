import {
  deleteOneProduct,
  updateProductThunk,
  type IAdminProduct,
  type ICreateAdminProduct,
} from "@/entities";
import React, { useEffect, useState } from "react";
import styles from "./AdminProductForm.module.css";
import { useAppDispatch } from "@/shared";

type AdminProductFormProps = {
  product: IAdminProduct;
  onClose: (() => void) | null;
};

export function AdminProductForm({
  product,
  onClose = null,
}: AdminProductFormProps) {
  const dispatch = useAppDispatch();
  const [productInput, setProductInput] = useState<ICreateAdminProduct>({
    img: product.img,
  });
  useEffect(() => {
    if (product) {
      setProductInput({
        img: product.img,
      });
    }
  }, [product]);

  const onChangeProductHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmitProductHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(updateProductThunk({ id: product.id, product: productInput }));
    } catch (error) {
      console.error(error);
    } finally {
      setProductInput({
        img: "",
      });
      onClose?.();
      dispatch(deleteOneProduct());
    }
  };
  return (
    <form className={styles.editForm} onSubmit={onSubmitProductHandler}>
      <div className={styles.formGroup}>
        <label htmlFor="img">URL изображения</label>
        <input
          id="img"
          type="text"
          name="img"
          placeholder="URL изображения"
          value={productInput.img}
          onChange={onChangeProductHandler}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>
          Сохранить
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => {
            onClose?.();
            dispatch(deleteOneProduct());
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
