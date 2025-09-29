import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, type ServerResponseType } from "@/shared";
import { AxiosError } from "axios";
import { type ICreateAdminNews, type IAdminNews, type AdminNewsArrayType, type ICreateAdminProduct, type IAdminProduct, type AdminProductArrayType, type OrderArrayType, ADMIN_API_ROUTES, type AdminVacancyArrayType, type IAdminVacancy, type ICreateAdminVacancy } from "../model";

export const getAllAdminNewsThunk = createAsyncThunk<ServerResponseType<AdminNewsArrayType>, void, { rejectValue: ServerResponseType }>('***admin/getAllNews***', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<AdminNewsArrayType>>(ADMIN_API_ROUTES.NEWS);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const getNewsByIdThunk = createAsyncThunk<ServerResponseType<IAdminNews>, number, { rejectValue: ServerResponseType }>('***admin/getNewsById***', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<IAdminNews>>(`${ADMIN_API_ROUTES.NEWS}/${id}`);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const createNewsThunk = createAsyncThunk<ServerResponseType<IAdminNews>, ICreateAdminNews, { rejectValue: ServerResponseType }>('***admin/createNews***', async (news, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post<ServerResponseType<IAdminNews>>(ADMIN_API_ROUTES.NEWS, news);
        return data;    
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const updateNewsThunk = createAsyncThunk<ServerResponseType<IAdminNews>, { id: number, news: ICreateAdminNews }, { rejectValue: ServerResponseType }>('***admin/updateNews***', async ({ id, news }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put<ServerResponseType<IAdminNews>>(`${ADMIN_API_ROUTES.NEWS}/${id}`, news);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const deleteNewsThunk = createAsyncThunk<ServerResponseType<IAdminNews>, number, { rejectValue: ServerResponseType }>('***admin/deleteNews***', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.delete<ServerResponseType<IAdminNews>>(`${ADMIN_API_ROUTES.NEWS}/${id}`);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const getAllProductsThunk = createAsyncThunk<ServerResponseType<AdminProductArrayType>, void, { rejectValue: ServerResponseType }>('***admin/getAllProducts***', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<AdminProductArrayType>>(ADMIN_API_ROUTES.PRODUCT);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const getProductByIdThunk = createAsyncThunk<ServerResponseType<IAdminProduct>, number, { rejectValue: ServerResponseType }>('***admin/getProductById***', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<IAdminProduct>>(`${ADMIN_API_ROUTES.PRODUCT}/${id}`);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const createProductThunk = createAsyncThunk<ServerResponseType<IAdminProduct>, ICreateAdminProduct, { rejectValue: ServerResponseType }>('***admin/createProduct***', async (product, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post<ServerResponseType<IAdminProduct>>(ADMIN_API_ROUTES.PRODUCT, product);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const updateProductThunk = createAsyncThunk<ServerResponseType<IAdminProduct>, { id: number, product: ICreateAdminProduct }, { rejectValue: ServerResponseType }>('***admin/updateProduct***', async ({ id, product }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put<ServerResponseType<IAdminProduct>>(`${ADMIN_API_ROUTES.PRODUCT}/${id}`, product);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const deleteProductThunk = createAsyncThunk<ServerResponseType<IAdminProduct>, number, { rejectValue: ServerResponseType }>('***admin/deleteProduct***', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.delete<ServerResponseType<IAdminProduct>>(`${ADMIN_API_ROUTES.PRODUCT}/${id}`);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const getOrdersByDateThunk = createAsyncThunk<ServerResponseType<OrderArrayType>, { date: string }, { rejectValue: ServerResponseType }>('***admin/getOrdersByDate***', async ({ date }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<OrderArrayType>>(`${ADMIN_API_ROUTES.ORDER}?date=${date}`);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const getAllAdminVacanciesThunk = createAsyncThunk<ServerResponseType<AdminVacancyArrayType>, void, { rejectValue: ServerResponseType }>('***admin/getAllVacancies***', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<AdminVacancyArrayType>>(ADMIN_API_ROUTES.VACANCY);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const getVacancyByIdThunk = createAsyncThunk<ServerResponseType<IAdminVacancy>, number, { rejectValue: ServerResponseType }>('***admin/getVacancyById***', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<IAdminVacancy>>(`${ADMIN_API_ROUTES.VACANCY}/${id}`);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const createVacancyThunk = createAsyncThunk<ServerResponseType<IAdminVacancy>, ICreateAdminVacancy, { rejectValue: ServerResponseType }>('***admin/createVacancy***', async (vacancy, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post<ServerResponseType<IAdminVacancy>>(ADMIN_API_ROUTES.VACANCY, vacancy);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const updateVacancyThunk = createAsyncThunk<ServerResponseType<IAdminVacancy>, { id: number, vacancy: ICreateAdminVacancy }, { rejectValue: ServerResponseType }>('***admin/updateVacancy***', async ({ id, vacancy }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put<ServerResponseType<IAdminVacancy>>(`${ADMIN_API_ROUTES.VACANCY}/${id}`, vacancy);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const deleteVacancyThunk = createAsyncThunk<ServerResponseType<IAdminVacancy>, number, { rejectValue: ServerResponseType }>('***admin/deleteVacancy***', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.delete<ServerResponseType<IAdminVacancy>>(`${ADMIN_API_ROUTES.VACANCY}/${id}`);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});
