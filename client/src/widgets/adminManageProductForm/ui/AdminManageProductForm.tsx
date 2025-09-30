import { useEffect, useState } from "react";
import styles from "./AdminManageProductForm.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllCategoriesThunk } from "@/entities";
import type { ICreateProduct, IProduct } from "@/entities/products";
import {
  createProductThunk,
  deleteOneProduct,
  updateFullProductThunk,
} from "@/entities/products";

const initialProductInput: ICreateProduct = {
  name: "",
  img: "",
  price: 0,
  recipe: "",
  weight: 0,
  category_id: 0,
  is_active: false,
  variants: [],
  variant_names: [],
};

type AdminManageProductProps = {
  onClose: (() => void) | null;
  setProCreateProduct: React.Dispatch<React.SetStateAction<boolean>> | null;
  product: IProduct | null;
};

export function AdminManageProductForm({
  setProCreateProduct = null,
  product = null,
  onClose = null,
}: AdminManageProductProps) {
  const dispatch = useAppDispatch();
  const { categoriesArray } = useAppSelector((state) => state.categories);

  const [productInput, setProductInput] = useState<ICreateProduct | IProduct>(
    product
      ? {
          name: product.name,
          img: product.img,
          price: product.price,
          recipe: product.recipe,
          weight: product.weight,
          category_id: product.category_id,
          is_active: product.is_active,
          variants: product.variants,
          variant_names: product.variant_names,
        }
      : initialProductInput
  );

  useEffect(() => {
    if (product) {
      setProductInput({
        name: product.name,
        img: product.img,
        price: product.price,
        recipe: product.recipe,
        weight: product.weight,
        category_id: product.category_id,
        is_active: product.is_active,
        variants: product.variants,
        variant_names: product.variant_names,
      });
    }
  }, [product]);

  const [productVariants, setProductVariants] = useState("");
  const [productVariantsNames, setProductVariantsNames] = useState("");
  const onChangeProductHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProductInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const onChangeProductIsActiveHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };
  const onSubmitProductHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (product) {
        dispatch(
          updateFullProductThunk({ id: product.id, product: productInput })
        );
      } else {
        dispatch(createProductThunk(productInput));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProductInput(initialProductInput);
      setProductVariants("");
      setProductVariantsNames("");
      setProCreateProduct?.(false);
      onClose?.();
      dispatch(deleteOneProduct());
    }
  };

  const addProductVariants = () => {
    if (productVariants.trim()) {
      const newVariants: string = productVariants.trim();
      setProductInput((prev: ICreateProduct) => ({
        ...prev,
        variants: [...(prev.variants || []), newVariants],
      }));
    }
    setProductVariants("");
  };

  const addProductVariantsNames = () => {
    if (productVariantsNames.trim()) {
      const newVariantsNames: string = productVariantsNames.trim();
      setProductInput((prev: ICreateProduct) => ({
        ...prev,
        variant_names: [...(prev.variant_names || []), newVariantsNames],
      }));
    }
    setProductVariantsNames("");
  };
  const removeProductVariant = (index: number) => {
    setProductInput((prev: ICreateProduct) => ({
      ...prev,
      variants: prev.variants?.filter((_, i) => i !== index) || [],
    }));
  };
  const removeProductVariantName = (index: number) => {
    setProductInput((prev: ICreateProduct) => ({
      ...prev,
      variant_names: prev.variant_names?.filter((_, i) => i !== index) || [],
    }));
  };

  useEffect(() => {
    try {
      dispatch(getAllCategoriesThunk());
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  return (
    <form className={styles.editForm} onSubmit={onSubmitProductHandler}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Название продукта</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Введите название продукта"
          value={productInput.name}
          onChange={onChangeProductHandler}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="img">URL изображения</label>
        <input
          id="img"
          type="text"
          name="img"
          placeholder="Введите URL изображения"
          value={productInput.img}
          onChange={onChangeProductHandler}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="price">Цена</label>
        <input
          id="price"
          type="number"
          name="price"
          placeholder="Введите цену продукта"
          value={productInput.price}
          onChange={onChangeProductHandler}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="recipe">Рецепт</label>
        <input
          id="recipe"
          type="text"
          name="recipe"
          placeholder="Введите рецепт продукта"
          value={productInput.recipe}
          onChange={onChangeProductHandler}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="weight">Вес</label>
        <input
          id="weight"
          type="number"
          name="weight"
          placeholder="Введите вес продукта"
          value={productInput.weight}
          onChange={onChangeProductHandler}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={productInput.is_active}
            onChange={onChangeProductIsActiveHandler}
          />
          <label htmlFor="is_active">Активность продукта</label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category_id">Категория продукта</label>
        <select
          id="category_id"
          name="category_id"
          value={productInput.category_id}
          onChange={onChangeProductHandler}
          className={styles.formInput}
        >
          {categoriesArray.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="variants">Варианты продуктов</label>
        <div className={styles.variantsSection}>
          <div className={styles.variantsInputGroup}>
            <input
              id="variants"
              type="text"
              name="variants"
              placeholder="Введите вариант продукта"
              value={productVariants}
              onChange={(event) => setProductVariants(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addProductVariants();
                }
              }}
              className={styles.formInput}
            />
            <button
              type="button"
              onClick={addProductVariants}
              className={styles.addVariantButton}
            >
              Добавить
            </button>
          </div>
          {(productInput.variants || []).length > 0 && (
            <div className={styles.variantsList}>
              {(productInput.variants || []).map((variant, index) => (
                <div key={index} className={styles.variantItem}>
                  <span>{variant}</span>
                  <button
                    type="button"
                    onClick={() => removeProductVariant(index)}
                    className={styles.variantRemoveButton}
                    title="Удалить вариант"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="variant_names">Названия вариантов</label>
        <div className={styles.variantsSection}>
          <div className={styles.variantsInputGroup}>
            <input
              id="variant_names"
              type="text"
              name="variant_names"
              placeholder="Введите название варианта"
              value={productVariantsNames}
              onChange={(event) => setProductVariantsNames(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addProductVariantsNames();
                }
              }}
              className={styles.formInput}
            />
            <button
              type="button"
              onClick={addProductVariantsNames}
              className={styles.addVariantButton}
            >
              Добавить
            </button>
          </div>
          {(productInput.variant_names || []).length > 0 && (
            <div className={styles.variantsList}>
              {(productInput.variant_names || []).map((variantName, index) => (
                <div key={index} className={styles.variantItem}>
                  <span>{variantName}</span>
                  <button
                    type="button"
                    onClick={() => removeProductVariantName(index)}
                    className={styles.variantRemoveButton}
                    title="Удалить название варианта"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>
          Сохранить
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => {
            setProCreateProduct?.(false);
            onClose?.();
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
