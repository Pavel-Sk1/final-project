import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { signUpThunk, UserValidator, type ISignUpData } from '@/entities';
import { CLIENT_ROUTES, useAppDispatch } from '@/shared';
import styles from './signUpForm.module.css';

// Начальные данные для формы регистрации
const INITIAL_INPUTS_DATA: ISignUpData = {
  login: '',  
  password: '',
  phone: '',
  role_id: 0,
};

export function SignUpForm() {
  // Состояние для хранения данных формы
  const [inputs, setInputs] = useState<ISignUpData>(INITIAL_INPUTS_DATA);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Обработчик изменения полей формы
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // Обработчик отправки формы
  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Валидация данных формы
    const { isValid, error } = UserValidator.validateSignUpData(inputs);

    if (!isValid) {
      alert(error);
      return;
    }

    try {
      // Отправка запроса на регистрацию
      dispatch(signUpThunk(inputs))
        .unwrap()
        .then(() => {
          setInputs(INITIAL_INPUTS_DATA);
          navigate(CLIENT_ROUTES.HOME);
        })
        .catch((error) => {
          alert(error.error || 'Ошибка при регистрации');
        });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        alert(error.response.data.error);
      } else {
        alert('Ошибка при регистрации');
      }
    }
  };

  return (
    <form className={styles.signUpForm} onSubmit={onSubmitHandler}>
      <h2 className={styles.formTitle}>Sign Up</h2>

      <div className={styles.inputGroup}>
        <input
          type='text'
          name='login'
          placeholder='Login'
          onChange={onChangeHandler}
          value={inputs.login}
          className={styles.formInput}
          autoFocus
          required
        />
      </div>

      {/* <div className={styles.inputGroup}>
        <input
          type='email'
          name='email'
          placeholder='Email'
          onChange={onChangeHandler}
          value={inputs.email}
          className={styles.formInput}
          required
        />
      </div> */}

      <div className={styles.inputGroup}>
        <input
          type='password'
          name='password'
          placeholder='Password'
          onChange={onChangeHandler}
          value={inputs.password}
          className={styles.formInput}
          required
        />
      </div>

      {/* <div className={styles.inputGroup}>
        <input
          type='password'
          name='repeatPassword'
          placeholder='Repeat Password'
          onChange={onChangeHandler}
          value={inputs.repeatPassword}
          className={styles.formInput}
          required
        />
      </div> */}

      <button type='submit' className={styles.submitButton}>
        Sign Up
      </button>
    </form>
  );
}
