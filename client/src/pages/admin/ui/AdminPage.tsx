import { useAppDispatch, useAppSelector } from "@/shared";
import styles from "./AdminPage.module.css";
import { useEffect, useState } from "react";
import {
  getAllAdminNewsThunk,
  getAllProductsThunk,
  updateNewsThunk,
  updateProductThunk,
} from "@/entities";

export function AdminPage() {
  const [editNews, setEditNews] = useState(false);
  const [editOneNews, setEditOneNews] = useState(false);
  const [editOneNewsId, setEditOneNewsId] = useState(0);
  const [editProduct, setEditProduct] = useState(false);
  const [editOneProduct, setEditOneProduct] = useState(false);
  const [editOneProductId, setEditOneProductId] = useState(0);
  const [newsInput, setNewsInput] = useState({
    title: "",
    description: "",
    img: "",
    is_active: false,
  });
  const [productInput, setProductInput] = useState({
    img: "",
  });
  const { newsArray, productArray } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  const onChangeInformationHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewsInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onChangeProductHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmitInformationHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      dispatch(
        updateNewsThunk({
          id: editOneNewsId,
          news: newsInput,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setEditOneNews(false);
    }
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

  useEffect(() => {
    dispatch(getAllAdminNewsThunk());
    dispatch(getAllProductsThunk());
  }, [dispatch]);

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Панель администратора</h1>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Новости на главной странице
            </h2>
            <button
              className={styles.toggleButton}
              onClick={() => setEditNews((prev) => !prev)}
            >
              {editNews ? "Скрыть" : "Редактировать"}
            </button>
          </div>

          {editNews && (
            <div className={styles.itemsContainer}>
              {newsArray.map((info) =>
                editOneNews && editOneNewsId === info.id ? (
                  <form
                    key={info.id}
                    className={styles.editForm}
                    onSubmit={onSubmitInformationHandler}
                  >
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        name="title"
                        placeholder="Название"
                        value={newsInput.title}
                        onChange={onChangeInformationHandler}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        name="description"
                        placeholder="Описание"
                        value={newsInput.description}
                        onChange={onChangeInformationHandler}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        name="img"
                        placeholder="URL изображения"
                        value={newsInput.img}
                        onChange={onChangeInformationHandler}
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
                        onClick={() => setEditOneNews(false)}
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                ) : (
                  <div key={info.id} className={styles.infoItem}>
                    <div className={styles.itemImage}>
                      <img src={info.img} alt={info.title} />
                    </div>
                    <div className={styles.itemContent}>
                      <h3 className={styles.itemTitle}>{info.title}</h3>
                      <p className={styles.itemDescription}>
                        {info.description}
                      </p>
                    </div>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setEditOneNews(true);
                        setEditOneNewsId(info.id);
                        setNewsInput({
                          title: info.title,
                          description: info.description,
                          img: info.img,
                          is_active: info.is_active,
                        });
                      }}
                    >
                      Редактировать
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Изображения продуктов</h2>
            <button
              className={styles.toggleButton}
              onClick={() => setEditProduct((prev) => !prev)}
            >
              {editProduct ? "Скрыть" : "Редактировать"}
            </button>
          </div>

          {editProduct && (
            <div className={styles.itemsContainer}>
              {productArray.map((product) =>
                editOneProduct && editOneProductId === product.id ? (
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
                ) : (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.itemImage}>
                      <img src={product.img} alt={product.name} />
                    </div>
                    <div className={styles.itemContent}>
                      <h3 className={styles.itemTitle}>{product.name}</h3>
                    </div>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setEditOneProduct(true);
                        setEditOneProductId(product.id);
                        setProductInput({ img: product.img });
                      }}
                    >
                      Редактировать
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

