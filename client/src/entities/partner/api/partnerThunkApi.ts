import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, type ServerResponseType } from "@/shared";
import { AxiosError } from "axios";
import { type PartnersArrayType, type IPartner, type ICreatePartner, PARTNER_API_ROUTES } from "../model";

export const getAllPartnersThunk = createAsyncThunk<ServerResponseType<PartnersArrayType>, void, { rejectValue: ServerResponseType }>(
    "***partner/getAllPartners***",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<ServerResponseType<PartnersArrayType>>(PARTNER_API_ROUTES.LIST);
            return data;
        } catch (error) {
            const err = error as AxiosError<ServerResponseType>;
            return rejectWithValue(err.response!.data);
        }
    }
);

export const getPartnerByIdThunk = createAsyncThunk<ServerResponseType<IPartner>, number, { rejectValue: ServerResponseType }>(
    "***partner/getPartnerById***",
    async (id , { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<ServerResponseType<IPartner>>(`${PARTNER_API_ROUTES.LIST}/${id}`);
            return data;
        } catch (error) {
            const err = error as AxiosError<ServerResponseType>;
            return rejectWithValue(err.response!.data);
        }
    }
);

export const createPartnerThunk = createAsyncThunk<ServerResponseType<IPartner>, ICreatePartner, { rejectValue: ServerResponseType }>(
    "***partner/createPartner***",
    async (partner, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post<ServerResponseType<IPartner>>(PARTNER_API_ROUTES.LIST, partner);
            return data;
        } catch (error) {
            const err = error as AxiosError<ServerResponseType>;
            return rejectWithValue(err.response!.data);
        }
    }
);

export const updatePartnerThunk = createAsyncThunk<ServerResponseType<IPartner>, { id: number, partner: ICreatePartner }, { rejectValue: ServerResponseType }>(
    "***partner/updatePartner***",
    async ({ id, partner }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put<ServerResponseType<IPartner>>(`${PARTNER_API_ROUTES.LIST}/${id}`, partner);
            return data;
        } catch (error) {
            const err = error as AxiosError<ServerResponseType>;
            return rejectWithValue(err.response!.data);
        }
    }
);

export const deletePartnerThunk = createAsyncThunk<ServerResponseType<IPartner>, number, { rejectValue: ServerResponseType }>(
    "***partner/deletePartner***",
    async ( id , { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete<ServerResponseType<IPartner>>(`${PARTNER_API_ROUTES.LIST}/${id}`);
            return data;
        } catch (error) {
            const err = error as AxiosError<ServerResponseType>;
            return rejectWithValue(err.response!.data);
        }
    }
);