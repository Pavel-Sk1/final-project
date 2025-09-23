import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import { CLIENT_ROUTES } from '@/shared';
import styles from './Footer.module.css';

export function Footer(): JSX.Element {
  // Хук для навигации между страницами
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>© {new Date().getFullYear()} Wolves Online Project</p>

        <nav className={styles.footerNav}>
          <button
            className={styles.footerButton}
            onClick={() => navigate(CLIENT_ROUTES.HOME)}
          >
            Home
          </button>          
        </nav>
      </div>
    </footer>
  );
}
