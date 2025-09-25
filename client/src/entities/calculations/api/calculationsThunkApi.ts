import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, type ServerResponseType } from "@/shared";
import { type IOrder, CALCULATIONS_API_ROUTES } from "../model";
import type { AxiosError } from "axios";

export const getOrdersByDateThunk = createAsyncThunk<
  ServerResponseType<IOrder[]>,
  { date: string; status?: string },
  { rejectValue: ServerResponseType }
>(
  "***calculations/getOrdersByDate***",
  async ({ date, status = "confirmed" }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ date });
      if (status) {
        params.append("status", status);
      }
      const { data } = await axiosInstance.get<ServerResponseType<IOrder[]>>(
        `${CALCULATIONS_API_ROUTES.LIST}?${params.toString()}`
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<ServerResponseType>;
      return rejectWithValue(err.response!.data);
    }
  }
);
