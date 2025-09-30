import { NavLink, useNavigate } from "react-router";
import { useCallback } from "react";
import { GiCroissant } from "react-icons/gi";
import { useAppDispatch, useAppSelector, CLIENT_ROUTES } from "@/shared";
import { signOutThunk } from "@/entities";
import styles from "./Navigation.module.css";

export function Navigation(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.user.user);

  const scrollToAnchor = useCallback((id: string) => {
    const doScroll = () => {
      if (id === "news") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (window.location.pathname !== CLIENT_ROUTES.HOME) {
      navigate(`${CLIENT_ROUTES.HOME}#${id}`);
      setTimeout(doScroll, 50);
    } else {
      doScroll();
    }
  }, [navigate]);

  const navigateOrScrollTop = useCallback((path: string) => {
    if (window.location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(path);
  }, [navigate]);
  const handleSignOut = async () => {
    dispatch(signOutThunk());
    navigate(CLIENT_ROUTES.HOME);
  };

  return (
    <nav className={styles.header} >
      <div className={styles.navLinks}>
        <div className={styles.brandWrapper}>
          <NavLink to={CLIENT_ROUTES.HOME} className={styles.brand}>
            <GiCroissant className={styles.brandIcon} />
            <span className={styles.brandTitle}>Ромарио</span>
          </NavLink>
          <ul className={styles.menuList} role="menu" aria-label="Основное меню">
            <li className={styles.menuItem} role="none">
              <span className={styles.menuItemLabel} role="menuitem">Навигация</span>
              <ul className={styles.subMenuList} role="menu" aria-label="Навигация подменю">
                <li role="none"><button className={styles.submenuLink} role="menuitem" onClick={() => scrollToAnchor("news")}>Новости</button></li>
                <li role="none"><button className={styles.submenuLink} role="menuitem" onClick={() => scrollToAnchor("about")}>О нас</button></li>
                <li role="none"><button className={styles.submenuLink} role="menuitem" onClick={() => scrollToAnchor("products")}>Наша продукция</button></li>
              </ul>
            </li>
            <li className={styles.menuItem} role="none">
              <span className={styles.menuItemLabel} role="menuitem">Сотрудничество</span>
              <ul className={styles.subMenuList} role="menu" aria-label="Сотрудничество подменю">
                <li role="none"><button onClick={() => navigateOrScrollTop(CLIENT_ROUTES.INFO)} className={styles.submenuLink} role="menuitem">Информация для юр. лиц</button></li>
                <li role="none"><button onClick={() => navigateOrScrollTop(CLIENT_ROUTES.INFO)} className={styles.submenuLink} role="menuitem">Предложение о сотрудничестве</button></li>
              </ul>
            </li>
            <li className={styles.menuItem} role="none">
              <span className={styles.menuItemLabel} role="menuitem">Контакты</span>
              <ul className={styles.subMenuList} role="menu" aria-label="Контакты подменю">
                <li role="none"><button onClick={() => navigateOrScrollTop(CLIENT_ROUTES.VACANCY)} className={styles.submenuLink} role="menuitem">Вакансии</button></li>
                <li role="none"><button onClick={() => navigateOrScrollTop(CLIENT_ROUTES.CONTACT)} className={styles.submenuLink} role="menuitem">Наши контакты</button></li>
              </ul>
            </li>
          </ul>
        </div>
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
        {user && user.role.name !== "admin" && (
          <NavLink
            to={CLIENT_ROUTES.USER}
            className={({ isActive }) =>
              `btn-primary ${isActive && "btn-primary--active"}`
            }
          >
            Личный кабинет
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
