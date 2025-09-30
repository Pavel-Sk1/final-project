
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared';
import { getProductsThunk, type IProduct } from '@/entities';
import { usePDF } from '@/features';
import styles from './InfoPage.module.css';

export  function InfoPage() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.info);
  const { generatePDF } = usePDF();

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  const handlePDF = () => {
    generatePDF(products);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Информация для юридических лиц</h1>
        
        <div className={styles.text}>
          <p>Приглашаем к сотрудничеству дилеров и дистрибьютеров!</p>
          <p>Наша организация занимается изготовлением</p>
          <p>кулинарных изысканий и мы приглашаем</p>
          <p>вас стать частью нашей команды в качестве</p>
          <p>дилера или дистрибьютера!</p>
        </div>

        <h2 className={styles.subtitle}>Вы можете ознакомится с нашим прайсом ниже:</h2>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}><h3>Наименование</h3></th>
                <th className={styles.th}><h3>Вес(г)</h3></th>
                <th className={styles.th}><h3>Цена (руб.)</h3></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: IProduct, index: number) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>{product.name}</td>
                  <td className={styles.td}>{product.weight}</td>
                  <td className={styles.td}>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonsContainer}>
          <button className={"btn-primary"} onClick={handlePDF}>
            Скачать/Печать
          </button>
        </div>
        <h2 className={styles.subtitlecontacts}>Наши контакты:</h2>
        <div className={styles.contacts}>
          <p>Телефон: +7 (999) 999-99-99</p>
          <p>Email: info@example.com</p>
          <p>Адрес: Москва, ул. Ленина, 1</p>
          <a href="https://t.me/sixchains" target= "_blank" >@Telegram</a>
        </div>
      </div>
    </div>
  );
}
