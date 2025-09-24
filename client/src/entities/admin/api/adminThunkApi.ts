import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, type ServerResponseType } from "@/shared";
import { AxiosError } from "axios";
import { type ICreateAdminInformation, type IAdminInformation, type AdminInfoArrayType, type ICreateAdminProduct, type IAdminProduct, type AdminProductArrayType, ADMIN_API_ROUTES } from "../model";

export const getAllInformationThunk = createAsyncThunk<ServerResponseType<AdminInfoArrayType>, void, { rejectValue: ServerResponseType }>('***admin/getAllInformation***', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<AdminInfoArrayType>>(ADMIN_API_ROUTES.INFORMATION);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const getInformationByIdThunk = createAsyncThunk<ServerResponseType<IAdminInformation>, number, { rejectValue: ServerResponseType }>('***admin/getInformationById***', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<IAdminInformation>>(`${ADMIN_API_ROUTES.INFORMATION}/${id}`);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const createInformationThunk = createAsyncThunk<ServerResponseType<IAdminInformation>, ICreateAdminInformation, { rejectValue: ServerResponseType }>('***admin/createInformation***', async (information, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post<ServerResponseType<IAdminInformation>>(ADMIN_API_ROUTES.INFORMATION, information);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const updateInformationThunk = createAsyncThunk<ServerResponseType<IAdminInformation>, { id: number, information: ICreateAdminInformation }, { rejectValue: ServerResponseType }>('***admin/updateInformation***', async ({ id, information }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put<ServerResponseType<IAdminInformation>>(`${ADMIN_API_ROUTES.INFORMATION}/${id}`, information);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

export const deleteInformationThunk = createAsyncThunk<ServerResponseType<IAdminInformation>, number, { rejectValue: ServerResponseType }>('***admin/deleteInformation***', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.delete<ServerResponseType<IAdminInformation>>(`${ADMIN_API_ROUTES.INFORMATION}/${id}`);
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

export const updateProductThunk = createAsyncThunk<ServerResponseType<IAdminProduct>, { id: number, product: ICreateAdminProduct }, { rejectValue: ServerResponseType }>('***admin/updateProduct***', async ({ id, product }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put<ServerResponseType<IAdminProduct>>(`${ADMIN_API_ROUTES.PRODUCT}/${id}`, product);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});