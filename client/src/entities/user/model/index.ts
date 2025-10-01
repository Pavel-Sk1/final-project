export interface ISignInData {
  password: string;
  login: string;
}

export interface ISignUpData {
  password: string;
  login: string;
  phone: string;
  role_id: number;
}

export interface IPartner {
  id: number;
  company_name: string;
  inn?: string;
  ogrn?: string;
  address?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  comment?: string;
  status?: string;
  user_id?: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface IUser {
  id: number;
  login: string;
  password?: string;
  phone: string;
  role_id: number;
  role?: { name: string };
  partner?: IPartner;
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
