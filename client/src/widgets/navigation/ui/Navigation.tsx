import { NavLink, useNavigate } from "react-router";
import { GiCroissant } from "react-icons/gi";
import { useAppDispatch, useAppSelector, CLIENT_ROUTES } from "@/shared";
import { signOutThunk } from "@/entities";
import styles from "./Navigation.module.css";

export function Navigation(): React.JSX.Element {
  // Хук для навигации между страницами
  const navigate = useNavigate();

  // Redux хуки для работы с состоянием
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user.user);

  // Обработчик выхода из системы
  const handleSignOut = async () => {
    dispatch(signOutThunk());
    navigate(CLIENT_ROUTES.HOME);
  };

  return (
    <nav className={styles.header}>
      <div className={styles.navLinks}>
        <NavLink to={CLIENT_ROUTES.HOME} className={styles.brand}>
          <GiCroissant className={styles.brandIcon} />
          <span className={styles.brandTitle}>Ромарио</span>
        </NavLink>
        {user?.role.name === "admin" && (
          <NavLink
            to={CLIENT_ROUTES.ADMIN}
            className={({ isActive }) =>
              `btn-primary ${isActive && "btn-primary--active"}`
            }
          >
            Админ
          </NavLink>
        )}
      </div>

      {/* Секция пользователя */}
      <div className={styles.userSection}>
        {user ? (
          <>
            <span className={styles.userGreeting}>Привет, {user.login}!</span>

            <button className={"btn-primary"} onClick={handleSignOut}>
              Выход
            </button>
          </>
        ) : (
            <button className={"btn-primary"} onClick={() => navigate(CLIENT_ROUTES.AUTH)}>
              Вход
            </button>
        )}
      </div>
    </nav>
  );
}
