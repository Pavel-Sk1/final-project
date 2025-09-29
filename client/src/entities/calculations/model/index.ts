export interface IOrder {
  id: number;
  tg_user_id: string;
  product_id: number;
  quantity: number;
  variant?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CALCULATIONS_API_ROUTES = {
  LIST: "/admin/order",
};
