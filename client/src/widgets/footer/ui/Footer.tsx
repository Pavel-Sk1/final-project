import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { CLIENT_ROUTES } from '@/shared';
import styles from './Footer.module.css';

export function Footer(): JSX.Element {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerColumns}>
          <div className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Навигация</h3>
            <nav className={styles.footerNav}>
              <button
                className={styles.footerLink}
                onClick={() => navigate(CLIENT_ROUTES.HOME)}
              >
                Новости
              </button>
              <button
                className={styles.footerLink}
                onClick={() => navigate(CLIENT_ROUTES.HOME)}
              >
                О нас
              </button>
              <button
                className={styles.footerLink}
                onClick={() => navigate(CLIENT_ROUTES.HOME)}
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
                onClick={() => navigate(CLIENT_ROUTES.VACANCY)}
              >
                Вакансии
              </button>
              <button
                className={styles.footerLink}
                onClick={() => navigate(CLIENT_ROUTES.VACANCY)}
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
