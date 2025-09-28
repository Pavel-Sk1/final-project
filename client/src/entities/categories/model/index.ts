export interface ICreateCategory {
    name: string;
    description: string;    
}

export interface ICategory extends ICreateCategory {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CategoriesArrayType = Array<ICategory>;

export const CATEGORIES_API_ROUTES = {
    LIST: "/categories",
};