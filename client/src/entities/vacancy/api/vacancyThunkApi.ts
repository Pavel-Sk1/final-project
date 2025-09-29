import { axiosInstance, type ServerResponseType } from "@/shared";
import { type IVacancy, VACANCY_API_ROUTES } from "../model";
import type { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllVacanciesThunk = createAsyncThunk<ServerResponseType<IVacancy[]>, void, { rejectValue: ServerResponseType }>(
  '***vacancy/getActiveOrdered***',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<ServerResponseType<IVacancy[]>>(VACANCY_API_ROUTES.ACTIVE_ORDERED);
      return data;
    } catch (error) {
      const err = error as AxiosError<ServerResponseType>;
      return rejectWithValue(err.response!.data);
    }
  }
);