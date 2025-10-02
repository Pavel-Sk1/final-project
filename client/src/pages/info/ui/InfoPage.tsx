
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, usePageTitle } from '@/shared';
import { getProductsThunk, type IProduct, getAllContactsThunk, type MainContact } from '@/entities';
import { formatPhonePretty, formatTelHref } from '@/shared/lib/phone';
import { usePDF } from '@/features';
import styles from './InfoPage.module.css';

export  function InfoPage() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.info);
  const { contacts } = useAppSelector((state) => state.contact);
  const { generatePDF } = usePDF();

  usePageTitle("Информация для юридических лиц");
  useEffect(() => {
    dispatch(getProductsThunk());
    dispatch(getAllContactsThunk());
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
          {contacts && contacts.length > 0 ? (
            contacts.map((c: MainContact) => (
              <div key={c.id}>
                <p>
                  Телефон: <a href={formatTelHref(c.phone as unknown as string)}>{formatPhonePretty(c.phone as unknown as string)}</a>
                </p>
                <p>
                  Email: <a href={`mailto:${c.email}`}>{c.email}</a>
                </p>
                <p>Адрес: {c.address}</p>
                <p>Telegram: <a href={c.telegram} target="_blank" rel="noreferrer">{c.telegram.replace('https://t.me/', '@')}</a></p>
              </div>
            ))
          ) : (
            <p>Контакты не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
}
