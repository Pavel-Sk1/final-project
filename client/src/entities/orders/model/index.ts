export interface IOrderItem {
  product_id: number;
  quantity: number;
  variant?: string;
  user_comment?: string;
  product?: {
    id: number;
    name: string;
    price: number;
    img: string;
  };
}

export interface ICreateOrder {
  items: IOrderItem[];
  user_comment?: string;
}

export interface IOrder {
  id: number;
  user_id: number;
  items: IOrderItem[];
  status: "pending" | "confirmed" | "cancelled" | "completed";
  user_comment?: string;
  admin_comment?: string;
  total_price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderProduct extends IOrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    img: string;
    variants?: string[];
    variant_names?: string[];
  };
}

export const ORDERS_API_ROUTES = {
  CREATE: "/orders",
  GET_USER_ORDERS: "/orders/user",
  GET_ORDER: "/orders",
} as const;
