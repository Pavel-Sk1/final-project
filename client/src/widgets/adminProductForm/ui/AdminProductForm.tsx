import { updateProductThunk, type IAdminProduct, type ICreateAdminProduct } from '@/entities';
import React from 'react'
import styles from "./AdminProductForm.module.css";
import type { AppDispatch } from '@/app/store/store';

type AdminProductFormProps = {
    product: IAdminProduct;
    dispatch: AppDispatch;
    setEditOneProduct: (value: boolean) => void;
    editOneProductId: number;    
    productInput: ICreateAdminProduct;
    setProductInput: React.Dispatch<React.SetStateAction<ICreateAdminProduct>>;
}


export function AdminProductForm({product, dispatch, setEditOneProduct, editOneProductId, productInput, setProductInput}: AdminProductFormProps ) {
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
          dispatch(
            updateProductThunk({ id: editOneProductId, product: productInput })
          );
        } catch (error) {
          console.error(error);
        } finally {
          setEditOneProduct(false);
        }
      };
  return (
    <form
            key={product.id}
            className={styles.editForm}
            onSubmit={onSubmitProductHandler}
          >
            <div className={styles.formGroup}>
              <input
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
                onClick={() => setEditOneProduct(false)}
              >
                Отмена
              </button>
            </div>
          </form>
  )
}
