import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';
import { CLIENT_ROUTES } from '@/shared';
import styles from './Footer.module.css';

export function Footer(): JSX.Element {
  const navigate = useNavigate();
  const scrollToAnchor = useCallback((id: string) => {
    const doScroll = () => {
      if (id === 'news') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate(path);
  }, [navigate]);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumns}>
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Навигация</h3>
            <nav className={styles.footerNav}>
              <button
                className={styles.footerLink}
                onClick={() => scrollToAnchor('news')}
              >
                Новости
              </button>
              <button
                className={styles.footerLink}
                onClick={() => scrollToAnchor('about')}
              >
                О нас
              </button>
              <button
                className={styles.footerLink}
                onClick={() => scrollToAnchor('products')}
              >
                Наша продукция
              </button>
            </nav>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Сотрудничество</h3>
            <nav className={styles.footerNav}>
              <button
                className={styles.footerLink}
                onClick={() => navigate(CLIENT_ROUTES.INFO)}
              >
                Информация для юр.лиц
              </button>
              <button
                className={styles.footerLink}
                onClick={() => navigate(CLIENT_ROUTES.INFO)}
              >
                Предложения о сотрудничестве
              </button>
            </nav>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Контакты</h3>
            <nav className={styles.footerNav}>
              <button
                className={styles.footerLink}
                onClick={() => navigateOrScrollTop(CLIENT_ROUTES.VACANCY)}
              >
                Вакансии
              </button>
              <button
                className={styles.footerLink}
                onClick={() => navigateOrScrollTop(CLIENT_ROUTES.CONTACT)}
              >
                Наши контакты
              </button>
            </nav>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerText}>© {new Date().getFullYear()} Семейное производство</p>
        </div>
      </div>
    </footer>
  );
}
