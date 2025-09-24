import styles from "./AdminPage.module.css";
import { useState } from "react";

function AdminPage() {
  const [editInformation, setEditInformation] = useState(false);
  const [editProduct, setEditProduct] = useState(false);

  

  const onSubmitInformationHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditInformation(false);
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
              <input type="text" placeholder="Название" />
              <input type="text" placeholder="Описание" />
              <button type="submit">Сохранить</button>
            </form>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default AdminPage;
