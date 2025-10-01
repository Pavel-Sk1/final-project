import type { ISignInData, ISignUpData } from "../model";

export class UserValidator {
  static validateEmail(email: string) {
    const emailPattern = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password: string) {
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumbers = /\d/;
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
    const isValidLength = password.length >= 8;

    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasNumbers.test(password) ||
      !hasSpecialCharacters.test(password) ||
      !isValidLength
    ) {
      return false;
    }

    return true;
  }

  static validateSignInData({ login, password }: ISignInData) {
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/;
    const isValidLength = login.length >= 3;
    if (
      !login ||
      typeof login !== 'string' ||
      login.trim().length === 0 ||
      hasSpecialCharacters.test(login) ||
      !isValidLength
    ) {
      return {
        isValid: false,
        error: 'Login не должен быть пустым и должен быть валидным',
      };
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim().length === 0
    ) {
      return {
        isValid: false,
        error: 'Пароль не должен быть пустым',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateSignUpData({ login, password }: ISignUpData) {
    if (
      !login ||
      typeof login !== 'string' ||
      login.trim().length === 0
    ) {
      return {
        isValid: false,
        error: 'Поле login не должно быть пустым',
      };
    }    

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim().length === 0 ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error:
          'Пароль не должен быть пустым, должен содержать одну большую букву, одну маленькую, один специальный символ, и не должен быть короче 8 символов',
      };
    }
    
    return {
      isValid: true,
      error: null,
    };
  }
}
