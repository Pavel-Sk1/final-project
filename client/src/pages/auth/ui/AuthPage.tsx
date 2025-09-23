import { SignUpForm, SignInForm } from '@/features';
import { useState } from 'react';

import styles from './AuthPage.module.css';

export function AuthPage() {
  // Состояние для переключения между формами регистрации и входа
  const [isSignUp, setIsSignUp] = useState(true);

 

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {/* Вкладки для переключения между формами */}
        <div className={styles.authTabs}>
          <button
            className={`${styles.authTab} ${isSignUp ? styles.active : ''}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className={`${styles.authTab} ${!isSignUp ? styles.active : ''}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
        </div>

        {/* Условное отображение формы в зависимости от выбранной вкладки */}
        {isSignUp ? (
          <SignUpForm />
        ) : (
          <SignInForm />
        )}
      </div>
    </div>
  );
}
