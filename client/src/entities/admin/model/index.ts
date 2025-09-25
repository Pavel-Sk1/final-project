export interface ICreateAdminNews {
  title: string;
  description: string;
  img: string;
  is_active: boolean;
}

export interface IAdminNews extends ICreateAdminNews {
  id: number;  
  createdAt?: Date;
  updatedAt?: Date;
}

export type AdminNewsArrayType = Array<IAdminNews>;

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

export interface IOrder {
  id: number;
  tg_user_id: string;
  product_id: number;
  quantity: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export type AdminProductArrayType = Array<IAdminProduct>;
export type OrderArrayType = Array<IOrder>;

export const ADMIN_API_ROUTES = {
  NEWS: "/admin/news",
  PRODUCT: "/admin/product",
  ORDER: "/admin/order",
};
