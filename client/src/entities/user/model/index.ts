export interface ISignInData {
  password: string;
  login: string;
}

export interface ISignUpData extends ISignInData {
  email: string;
  repeatPassword: string;
}

export interface IUser extends ISignUpData {
  id: number;
  role_id: number;
  role: { name: string };
  createdAt: Date;
  updatedAt: Date;
}


export type UserResponseType = {
  user: IUser;
  accessToken: string;
};

export enum USER_API_ROUTES {
  REFRESH_TOKENS = '/auth/refreshTokens',
  SIGN_UP = '/auth/signUp',
  SIGN_IN = '/auth/signIn',
  SIGN_OUT = '/auth/signOut',
}
