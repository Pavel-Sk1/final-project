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

  static validateSignInData({ email, password }: ISignInData) {
    if (
      !email ||
      typeof email !== 'string' ||
      email.trim().length === 0 ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: 'Email не должен быть пустым и должен быть валидным',
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
          'Пароль не должен быть пустым, должен содержать хотя бы одну цифру, одну заглавную букву, одну строчную букву, один специальный символ и быть не менее 8 символов',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateSignUpData({ username, email, password, repeatPassword }: ISignUpData) {
    if (
      !username ||
      typeof username !== 'string' ||
      username.trim().length === 0
    ) {
      return {
        isValid: false,
        error: 'Поле username не должно быть пустым',
      };
    }

    if (
      !email ||
      typeof email !== 'string' ||
      email.trim().length === 0 ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: 'Email должен быть валидным',
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

    if (
      !repeatPassword ||
      typeof repeatPassword !== 'string' ||
      repeatPassword.trim().length === 0 ||
      !this.validatePassword(repeatPassword)
    ) {
      return {
        isValid: false,
        error:
          'Пароль не должен быть пустым, должен содержать одну большую букву, одну маленькую, один специальный символ, и не должен быть короче 8 символов',
      };
    }

    if (password !== repeatPassword) {
      return {
        isValid: false,
        error: 'Пароли не совпадают',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }
}
