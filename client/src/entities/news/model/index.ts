export interface INewsItem {
  id: number;
  title: string;
  discription?: string;
  img?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const NEWS_API_ROUTES = {
  LIST: '/news',
} 


