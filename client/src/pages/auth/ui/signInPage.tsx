import { SignInForm } from '@/features';
import styles from './signInPage.module.css';
import { usePageTitle } from '@/shared';

export function SignInPage() {
  usePageTitle("Вход");
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SignInForm />
      </div>
    </div>
  );
}

