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
  ImageUpload,
  axiosInstance,
} from "@/shared";
import {
  type StoredImage,
  uploadStoredImageToServer,
  clearAllStoredImages,
} from "@/shared/lib/imageUtils";

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
  const [storedImage, setStoredImage] = useState<StoredImage | null>(null);
  useEffect(() => {
    if (product) {
      setProductInput({
        img: product.img,
      });
    }
  }, [product]);

  // const onChangeProductHandler = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setProductInput((prev) => ({
  //     ...prev,
  //     [event.target.name]: event.target.value,
  //   }));
  // };

  const onSubmitProductHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      let finalProductInput = { ...productInput };

      // Если есть сохраненное изображение в localStorage, загружаем его на сервер
      if (storedImage) {
        try {
          const uploadedImageUrl = await uploadStoredImageToServer(
            storedImage,
            axiosInstance
          );
          finalProductInput.img = uploadedImageUrl;

          // Очищаем localStorage после успешной загрузки
          clearAllStoredImages();
          setStoredImage(null);
        } catch (error) {
          console.error("Error uploading image:", error);
          showError(
            "Ошибка загрузки изображения",
            "Не удалось загрузить изображение на сервер. Попробуйте снова."
          );
          return;
        }
      }

      const result = await dispatch(
        updateProductThunk({ id: product.id, product: finalProductInput })
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
          <label htmlFor="img">Изображение продукта</label>
          <ImageUpload
            currentImageUrl={productInput.img}
            onImageChange={(url) =>
              setProductInput((prev) => ({ ...prev, img: url }))
            }
            onImageClear={() =>
              setProductInput((prev) => ({ ...prev, img: "" }))
            }
            placeholder="Введите URL изображения или загрузите файл"
            useLocalStorage={true}
            storedImageId={storedImage?.id}
            onStoredImageChange={setStoredImage}
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
