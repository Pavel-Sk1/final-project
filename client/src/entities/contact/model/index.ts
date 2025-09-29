export interface MainContact { 
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone: number;
    telegram: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export const CONTACT_API_ROUTES = {
    LIST: "/contact",
}