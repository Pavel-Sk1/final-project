import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, type ServerResponseType } from "@/shared";
import { AxiosError } from "axios";
import { type CategoriesArrayType, CATEGORIES_API_ROUTES } from "../model";

export const getAllCategoriesThunk = createAsyncThunk<ServerResponseType<CategoriesArrayType>, void, { rejectValue: ServerResponseType }>(
    "***categories/getAllCategories***",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<ServerResponseType<CategoriesArrayType>>(CATEGORIES_API_ROUTES.LIST);
            return data;
        } catch (error) {
            const err = error as AxiosError<ServerResponseType>;
            return rejectWithValue(err.response!.data);
        }
    }
);