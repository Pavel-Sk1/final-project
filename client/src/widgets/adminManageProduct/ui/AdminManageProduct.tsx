import { useEffect, useState } from "react";
import styles from "./AdminManageProduct.module.css";
import { useAppDispatch, useAppSelector } from "@/shared";
import { getAllCategoriesThunk } from "@/entities";
import type { ICreateProduct } from "@/entities/products/model";

export function AdminManageProduct() {
  const dispatch = useAppDispatch();
  const { categoriesArray } = useAppSelector((state) => state.categories);

  const [productInput, setProductInput] = useState<ICreateProduct>({
    name: "",
    img: "",
    price: 0,
    recipe: "",
    weight: 0,
    category_id: 0,
    is_active: false,
    variants: [],
    variant_names: [],
  });
  const [productVariants, setProductVariants] = useState("");
  const [productVariantsNames, setProductVariantsNames] = useState("");
  const onChangeProductHandler = (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
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
  };
  useEffect(() => {
    dispatch(getAllCategoriesThunk());
  }, [dispatch]);

  const addProductVariants = () => {
    if (productVariants.trim()) {
      const newVariants:string = productVariants.trim();
      setProductInput((prev: ICreateProduct) => ({
        ...prev,
        variants: [...prev.variants || [], newVariants],
      }));
    } 
    setProductVariants("");
  }

  const addProductVariantsNames = () => {
    if (productVariantsNames.trim()) {
      const newVariantsNames:string = productVariantsNames.trim();
      setProductInput((prev: ICreateProduct) => ({
        ...prev,
        variant_names: [...prev.variant_names || [], newVariantsNames],
      }));
    }
    setProductVariantsNames("");
  }

  return (
    <form className={styles.editForm} onSubmit={onSubmitProductHandler}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Название продукта</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="ВВедите название продукта"
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
          placeholder="ВВедите URL изображения"
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
          placeholder="ВВедите цену продукта"
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
          placeholder="ВВедите рецепт продукта"
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
          placeholder="ВВедите вес продукта"
          value={productInput.weight}
          onChange={onChangeProductHandler}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="is_active">Активность</label>
        <input
          type="checkbox"
          name="is_active"
          placeholder="ВВедите активность"
          checked={productInput.is_active}
          onChange={onChangeProductIsActiveHandler}
          className={styles.formInput}
        />
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
        <label htmlFor="variants">Варианты</label>
        <input
          id="variants"
          type="text"
          name="variants"
          placeholder="ВВедите варианты"
          value={productVariants}
          onChange={(event) => setProductVariants(event.target.value)}
          className={styles.formInput}
        />
      </div>
    </form>
  );
}
