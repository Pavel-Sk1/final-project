import { SignInForm } from '@/features';
import styles from './signInPage.module.css';

export function SignInPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SignInForm />
      </div>
    </div>
  );
}

