import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, type ServerResponseType } from "@/shared";
import { CONTACT_API_ROUTES, type MainContact } from "../model";
import type { AxiosError } from "axios";

export const getAllContactsThunk = createAsyncThunk<ServerResponseType<MainContact[]>, void, { rejectValue: ServerResponseType }>(
    "***contact/getAllContacts***",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<ServerResponseType<MainContact[]>>(CONTACT_API_ROUTES.LIST);
            return data;
        } catch (error) {
            const err = error as AxiosError<ServerResponseType>;
            return rejectWithValue(err.response!.data);
        }
    }
);
