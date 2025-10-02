import type { IUser } from "@/entities/user";

export interface ICreatePartner {
  company_name: string;
  inn: string;
  ogrn: string;
  address: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  comment: string;
  status: string;
  user_id: number;
}

export interface ICreatePartnerWithUser {
  login: string;
  phone: string;
  password?: string;
  role_id: number;
  company_name: string;
  inn: string;
  ogrn: string;
  address: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  comment: string;
  status: string;
}

export interface IPartner extends ICreatePartner {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPartnerWithUser {
  id: number;
  company_name: string;
  inn: string;
  ogrn: string;
  address: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  comment: string;
  status: string;
  user: IUser;
  user_id: number;
  createdAt: Date;
  updatedAt: Date;
}
export type PartnersArrayType = Array<IPartner>;
export type PartnersArrayWithUserType = Array<IPartnerWithUser>;

export const PARTNER_API_ROUTES = {
  LIST: "/partners",
  LIST_WITH_USER: "/partners/user",
} as const;
