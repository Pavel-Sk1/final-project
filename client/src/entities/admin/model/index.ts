export interface ICreateAdminInformation {
  title: string;
  description: string;
  img: string;
}

export interface IAdminInformation extends ICreateAdminInformation {
  id: number;
  page?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AdminInfoArrayType = Array<IAdminInformation>;

export interface ICreateAdminProduct {
  img: string;
}

export interface IAdminProduct extends ICreateAdminProduct {
  id: number;
  name: string;
  price: number;
  recipe: string;
  category_id: number;
  is_active: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AdminProductArrayType = Array<IAdminProduct>;

export const ADMIN_API_ROUTES = {
  INFORMATION: "/information",
  PRODUCT: "/product",
};
