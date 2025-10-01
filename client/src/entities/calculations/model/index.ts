export interface IOrder {
  id: number;
  tg_user_id: string;
  product_id: number;
  quantity: number;
  variant?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  product?: {
    id: number;
    name: string;
    price: number;
    variants?: string[];
    variant_names?: string[];
  };
  tgUser?: {
    tg_user_id: string;
    first_name?: string;
    last_name?: string;
    tg_username?: string;
    user?: {
      id: number;
      login: string;
      email?: string;
      phone?: string;
      partner?: {
        id: number;
        company_name: string;
        contact_person?: string;
        contact_email?: string;
        contact_phone?: string;
      };
    };
  };
}

export const CALCULATIONS_API_ROUTES = {
  LIST: "/admin/order",
};
