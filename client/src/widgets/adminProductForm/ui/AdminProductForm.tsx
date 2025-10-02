import {
  deleteOneProduct,
  updateProductThunk,
  type IAdminProduct,
  type ICreateAdminProduct,
} from "@/entities";
import React, { useEffect, useState } from "react";
import styles from "./AdminProductForm.module.css";
import {
  useAppDispatch,
  useModalNotifications,
  SuccessModal,
  ErrorModal,
} from "@/shared";

type AdminProductFormProps = {
  product: IAdminProduct;
  onClose: (() => void) | null;
};

export function AdminProductForm({
  product,
  onClose = null,
}: AdminProductFormProps) {
  const dispatch = useAppDispatch();
  const {
    successModal,
    errorModal,
    showSuccess,
    showError,
    closeSuccess,
    closeError,
  } = useModalNotifications();
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

  const onSubmitProductHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const result = await dispatch(
        updateProductThunk({ id: product.id, product: productInput })
      );
      if (updateProductThunk.fulfilled.match(result)) {
        showSuccess("Продукт обновлен", "Продукт был успешно обновлен!");
      } else {
        showError(
          "Ошибка обновления",
          "Не удалось обновить продукт. Попробуйте снова."
        );
      }
    } catch (error) {
      console.error(error);
      showError("Ошибка", "Произошла неожиданная ошибка. Попробуйте снова.");
    }
  };

  // Функция для закрытия формы после успешной операции
  const handleCloseForm = () => {
    setProductInput({
      img: "",
    });
    onClose?.();
    dispatch(deleteOneProduct());
  };

  return (
    <>
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
            onClick={handleCloseForm}
          >
            Отмена
          </button>
        </div>
      </form>

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => {
          closeSuccess();
          handleCloseForm();
        }}
        title={successModal.title}
        message={successModal.message}
        buttonText={successModal.buttonText}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeError}
        title={errorModal.title}
        message={errorModal.message}
        buttonText={errorModal.buttonText}
      />
    </>
  );
}
