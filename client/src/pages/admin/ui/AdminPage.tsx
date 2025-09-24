import { useAppDispatch, useAppSelector } from "@/shared";
import styles from "./AdminPage.module.css";
import { useEffect, useState } from "react";
import {
  getAllInformationThunk,
  getAllProductsThunk,
  updateInformationThunk,
  updateProductThunk,
} from "@/entities";

function AdminPage() {
  const [editInformation, setEditInformation] = useState(false);
  const [editOneInfo, setEditOneInfo] = useState(false);
  const [editOneInfoId, setEditOneInfoId] = useState(0);
  const [editProduct, setEditProduct] = useState(false);
  const [editOneProduct, setEditOneProduct] = useState(false);
  const [editOneProductId, setEditOneProductId] = useState(0);
  const [informationInput, setInformationInput] = useState({
    title: "",
    description: "",
    img: "",
  });
  const [productInput, setProductInput] = useState({
    img: "",
  });
  const { infoArray, productArray, error, loading } =
    useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  const onChangeInformationHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInformationInput((prev) => ({
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
        updateInformationThunk({
          id: editOneInfoId,
          information: informationInput,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setEditOneInfo(false);
    }
  };

  const onSubmitProductHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(updateProductThunk({id: editOneProductId, product: productInput}));
    } catch (error) {
      console.error(error);
    } finally {
      setEditOneProduct(false);
    }    
  };

  useEffect(() => {
    dispatch(getAllInformationThunk());
    dispatch(getAllProductsThunk());
  }, []);

  return (
    <div className={styles.adminPage}>
      <div className="information">
        <button onClick={() => setEditInformation((prev) => !prev)}>
          Редактировать информацию на главной странице
        </button>
        {editInformation && (
          <div className="information_container">
            {infoArray.map((info) =>
              editOneInfo && editOneInfoId === info.id ? (
                <form onSubmit={onSubmitInformationHandler}>
                  <input
                    type="text"
                    placeholder="Название"
                    value={informationInput.title}
                    onChange={onChangeInformationHandler}
                  />
                  <input
                    type="text"
                    placeholder="Описание"
                    value={informationInput.description}
                    onChange={onChangeInformationHandler}
                  />
                  <input
                    type="text"
                    placeholder="Изображение"
                    value={informationInput.img}
                    onChange={onChangeInformationHandler}
                  />
                  <button type="submit">Сохранить</button>
                </form>
              ) : (
                <div key={info.id} className="information_item">
                  <h3>{info.title}</h3>
                  <p>{info.description}</p>
                  <img src={info.img} alt={info.title} />
                  <button
                    onClick={() => {
                      setEditOneInfo(true);
                      setEditOneInfoId(info.id);
                      setInformationInput({
                        title: info.title,
                        description: info.description,
                        img: info.img,
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
      </div>
      <div className="product">
        <button onClick={() => setEditProduct((prev) => !prev)}>
          Редактировать изображения продуктов
        </button>
        {editProduct && (
          <div className="product_container">
            {productArray.map((product) =>
              editOneProduct && editOneProductId === product.id ? (
                <form onSubmit={onSubmitProductHandler}>
                  <input type="text" placeholder="Изображение" value={productInput.img} onChange={onChangeProductHandler} />
                  <button type="submit">Сохранить</button>
                </form>
              ) : (
                <div key={product.id} className="product_item">
                  <img src={product.img} alt={product.name} />
                  <button onClick={() => {setEditOneProduct(true); setEditOneProductId(product.id); setProductInput({img: product.img});}}>Редактировать</button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
