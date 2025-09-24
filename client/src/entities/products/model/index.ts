export interface IProductImage {
  id: number;
  img: string | null;
}

export const PRODUCTS_API_ROUTES = {
  LIST: '/products',
} as const;


