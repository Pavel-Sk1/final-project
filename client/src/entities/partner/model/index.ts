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
}

export interface IPartner extends ICreatePartner {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PartnersArrayType = Array<IPartner>;

export const PARTNER_API_ROUTES = {
  LIST: "/partners",
} as const;
