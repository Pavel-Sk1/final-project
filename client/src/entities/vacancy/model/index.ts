export interface IVacancy {
    id: number;
    position: string;
    location: string;
    salary: string;
    description: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export const VACANCY_API_ROUTES = {
    ACTIVE_ORDERED: '/vacancy',
}
