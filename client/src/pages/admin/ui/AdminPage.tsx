import styles from "./AdminPage.module.css";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { getOrdersByDateThunk } from "@/entities";
import {
  AdminCreateNewsForm,
  AdminManageProductForm,
  AdminManageProductList,
  AdminNewsList,
  AdminProductList,
  AdminVacancyList,
  AdminCreateVacancyForm,
  AdminPartnerForm,
  AdminPartnerList,
} from "@/widgets";
import { AdminCalculationsPage } from "@/widgets/adminCalculationsPage";

export function AdminPage() {
  const [createNews, setCreateNews] = useState(false);
  const [editNews, setEditNews] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [proCreateProduct, setProCreateProduct] = useState(false);
  const [proEditProduct, setProEditProduct] = useState(false);
  const [tab, setTab] = useState("editMainPage");
  const [editCalculations, setEditCalculations] = useState(false);
  const [manageVacancies, setManageVacancies] = useState(false);
  const [createVacancy, setCreateVacancy] = useState(false);
  const [manageContacts, setManageContacts] = useState(false);
  const [createPartner, setCreatePartner] = useState(false);
  const [editPartners, setEditPartners] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(
    (state) => state.calculations
  );

  useEffect(() => {
    if (editCalculations && selectedDate) {
      dispatch(
        getOrdersByDateThunk({ date: selectedDate, status: "confirmed" })
      );
    }
  }, [editCalculations, selectedDate, dispatch]);

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Панель администратора</h1>
        <div className={styles.adminNav}>
          <button
            className={tab === "editMainPage" ? "active" : ""}
            onClick={() => setTab("editMainPage")}
          >
            Редактировать главную страницу
          </button>
          <button
            className={tab === "statistics" ? "active" : ""}
            onClick={() => setTab("statistics")}
          >
            Статистика заказов
          </button>
          <button
            className={tab === "regPartners" ? "active" : ""}
            onClick={() => setTab("regPartners")}
          >
            Зарегистрировать дистрибьютора
          </button>
          <button
            className={tab === "manageProducts" ? "active" : ""}
            onClick={() => setTab("manageProducts")}
          >
            Управление продуктами
          </button>
          <button
            className={tab === "manageVacancies" ? "active" : ""}
            onClick={() => setTab("manageVacancies")}
          >
            Редактировать вакансии
          </button>
          <button
            className={tab === "manageContacts" ? "active" : ""}
            onClick={() => setTab("manageContacts")}
          >
            Управление контактами
          </button>
        </div>
        {tab === "editMainPage" && (
          <>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Создать новую новость</h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setCreateNews((prev) => !prev)}
                >
                  {createNews ? "Скрыть" : "Создать"}
                </button>
              </div>
              {createNews && (
                <AdminCreateNewsForm setCreateNews={setCreateNews} />
              )}
            </section>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Редактировать новости на главной странице
                </h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setEditNews((prev) => !prev)}
                >
                  {editNews ? "Скрыть" : "Редактировать"}
                </button>
              </div>

              {editNews && <AdminNewsList />}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Редактировать изображения продуктов на главной странице
                </h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setEditProduct((prev) => !prev)}
                >
                  {editProduct ? "Скрыть" : "Редактировать"}
                </button>
              </div>

              {editProduct && <AdminProductList />}
            </section>
          </>
        )}
        {tab === "statistics" && (
          <>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Cтатистикa заказов</h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setEditCalculations((prev) => !prev)}
                >
                  {editCalculations ? "Скрыть" : "Редактировать"}
                </button>
              </div>
              {editCalculations && (
                <div>
                  <div
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <label
                      htmlFor="orderDate"
                      style={{ fontWeight: "500", color: "#374151" }}
                    >
                      📅 Дата заказов:
                    </label>
                    <input
                      type="date"
                      id="orderDate"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "white",
                        fontSize: "14px",
                        minWidth: "150px",
                      }}
                    />
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>
                      ✅ Только подтвержденные заказы
                    </div>
                  </div>
                  <AdminCalculationsPage
                    orders={orders}
                    loading={loading}
                    error={error}
                    selectedDate={selectedDate}
                  />
                </div>
              )}
            </section>
          </>
        )}
        {tab === "regPartners" && 
        <>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Создать дистрибьютора</h2>
            <button
              className={styles.toggleButton}
              onClick={() => setCreatePartner((prev) => !prev)}
            >
              {createPartner ? "Скрыть" : "Создать"}
            </button>
          </div>
          {createPartner && (
            <AdminPartnerForm 
            setCreatePartner={setCreatePartner} 
            partner={null}
            setEditOnePartner={null}
            />
          )}
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Редактировать дистрибьюторов</h2>
            <button
              className={styles.toggleButton}
              onClick={() => setEditPartners((prev) => !prev)}
            >
              {editPartners ? "Скрыть" : "Редактировать"}
            </button>
          </div>
          {editPartners && (
            <>
            <AdminPartnerList />
            </>
          )}
        </section>
        </>}
        {tab === "manageProducts" && (
          <>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Создать продукт</h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setProCreateProduct((prev) => !prev)}
                >
                  {proCreateProduct ? "Скрыть" : "Создать"}
                </button>
              </div>
              {proCreateProduct && (
                <AdminManageProductForm
                  setProCreateProduct={setProCreateProduct}
                  setProEditOneProduct={null}
                  product={null}
                />
              )}
            </section>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Редактировать продукты</h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setProEditProduct((prev) => !prev)}
                >
                  {proEditProduct ? "Скрыть" : "Редактировать"}
                </button>
              </div>
              {proEditProduct && (<AdminManageProductList />)}
            </section>
          </>
        )}
        {tab === "manageVacancies" && (
          <>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Создать вакансию</h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setCreateVacancy((prev) => !prev)}
                >
                  {createVacancy ? "Скрыть" : "Создать"}
                </button>
              </div>
              {createVacancy && (
                <AdminCreateVacancyForm setCreateVacancy={setCreateVacancy} />
              )}
            </section>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Редактировать вакансии</h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setManageVacancies((prev) => !prev)}
                >
                  {manageVacancies ? "Скрыть" : "Редактировать"}
                </button>
              </div>
              {manageVacancies && (<AdminVacancyList />)}
            </section>
          </>
        )}
        {tab === "manageContacts" && (
          <>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Редактировать контакты</h2>
                <button
                  className={styles.toggleButton}
                  onClick={() => setManageContacts((prev) => !prev)}
                >
                  {manageContacts ? "Скрыть" : "Редактировать"}
                </button>
              </div>
              {manageContacts && <>ТУТ БУДЕТ СТРАНИЦА РЕДАКТИРОВАНИЯ КОНТАКТОВ</>}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
