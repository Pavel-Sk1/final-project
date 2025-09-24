import { NavLink, useNavigate } from 'react-router';
import { GiCroissant } from 'react-icons/gi';
import { useAppDispatch, useAppSelector, CLIENT_ROUTES } from '@/shared';
import { signOutThunk } from '@/entities';
import styles from './Navigation.module.css';

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
        <NavLink
          to={CLIENT_ROUTES.HOME}
          className={styles.brand}
        >
          <GiCroissant className={styles.brandIcon} />
          <span className={styles.brandTitle}>Ромарио</span>
        </NavLink>
      </div>

      {/* Секция пользователя */}
      <div className={styles.userSection}>
        {user ? (
          <>
            <span className={styles.userGreeting}>Hello, {user.username}!</span>
            <button
              className={styles.signOutButton}
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="auth-buttons">
            <NavLink
              to={CLIENT_ROUTES.AUTH}
              className={({ isActive }) =>
                `btn-primary ${isActive && 'btn-primary--active'}`
              }
            >
              Вход
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
