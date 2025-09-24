import styles from "./AdminPage.module.css";
import { useState } from "react";

export function AdminPage() {
  const [editInformation, setEditInformation] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [information, setInformation] = useState({
    title: "",
    description: "",
    img: "",
  });
  const [product, setProduct] = useState({    
    img: "",    
  });

  const onChangeInformationHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInformation((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onChangeProductHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduct((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmitInformationHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setEditInformation(false);
  };

  const onSubmitProductHandler = (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    setEditProduct(false);
  };

  return (
    <div className={styles.adminPage}>
      <div>
        <button onClick={() => setEditInformation((prev) => !prev)}>
          Редактировать информацию
        </button>
        {editInformation && (
          <div>
            <form onSubmit={onSubmitInformationHandler}>
              <input type="text" placeholder="Название" value={information.title} onChange={onChangeInformationHandler} />
              <input type="text" placeholder="Описание" value={information.description} onChange={onChangeInformationHandler} />
              <input type="text" placeholder="Изображение" value={information.img} onChange={onChangeInformationHandler} />
              <button type="submit">Сохранить</button>
            </form>
          </div>
        )}
      </div>
      <div>
        <button onClick={() => setEditProduct((prev) => !prev)}>
          Редактировать продукт
        </button>
        {editProduct && <div>
          <form onSubmit={onSubmitProductHandler}>            
            <input type="text" placeholder="Изображение" value={product.img} onChange={onChangeProductHandler} />
            <button type="submit">Сохранить</button>
          </form>
        </div>}
      </div>
    </div>
  );
}

