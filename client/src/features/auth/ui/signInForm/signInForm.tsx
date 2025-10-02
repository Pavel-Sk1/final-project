import { useState } from 'react';
import { useNavigate } from 'react-router';
import { type ISignInData, signInThunk, UserValidator } from '@/entities';
import { AxiosError } from 'axios';
import { CLIENT_ROUTES, useAppDispatch } from '@/shared';
import styles from './signInForm.module.css';


const INITIAL_INPUTS_DATA: ISignInData = {
  login: '',
  password: '',
};

export function SignInForm() {
  
  const [inputs, setInputs] = useState<ISignInData>(INITIAL_INPUTS_DATA);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, error } = UserValidator.validateSignInData(inputs);

    if (!isValid) {
      alert(error);
      return;
    }

    try {
      
      dispatch(signInThunk(inputs))
        .unwrap()
        .then((res) => {
          setInputs(INITIAL_INPUTS_DATA);
          const role = res.data.user.role;
          if (role?.name === 'admin') {
            navigate(CLIENT_ROUTES.ADMIN);
          } else {
            navigate(CLIENT_ROUTES.HOME);
          }
        })
        .catch((error) => {
          alert(error.error);
        });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        alert(error.response.data.error);
      } else {
        alert('Error during login');
      }
    }
  };

  return (
    <form className={styles.signInForm} onSubmit={onSubmitHandler}>
      <h2 className={styles.formTitle}>Вход</h2>

      <div className={styles.inputGroup}>
        <input
          type='text'
          name='login'
          placeholder='Логин'
          onChange={onChangeHandler}
          value={inputs.login}
          className={styles.formInput}
          autoFocus
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          type='password'
          name='password'
          placeholder='Пароль'
          onChange={onChangeHandler}
          value={inputs.password}
          className={styles.formInput}
          required
        />
      </div>

      <button type='submit' className={styles.submitButton}>
        Войти
      </button>
    </form>
  );
}
