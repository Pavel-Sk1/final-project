export interface IProductImage {
  id: number;
  img: string | null;
}

export const PRODUCTS_API_ROUTES = {
  LIST: '/products',
  ALL: '/products/all',
} as const;

export interface ICreateProduct {
  name: string;
  img: string;
  price: number;
  recipe: string;
  weight: number;
  category_id: number;
  is_active: boolean;
  variants: string[];
  variant_names: string[];
}

export interface IProduct extends ICreateProduct {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IProductArrayType = Array<IProduct>;
