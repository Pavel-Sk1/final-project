import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, type ServerResponseType } from "@/shared";
import { type ICreateOrder, type IOrder, ORDERS_API_ROUTES } from "../model";
import type { AxiosError } from "axios";

export const createOrderThunk = createAsyncThunk<
  ServerResponseType<IOrder>,
  ICreateOrder,
  { rejectValue: ServerResponseType }
>("***orders/createOrder***", async (order, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ServerResponseType<IOrder>>(
      ORDERS_API_ROUTES.CREATE,
      order
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<ServerResponseType>;
    return rejectWithValue(err.response!.data);
  }
});

export const getUserOrdersThunk = createAsyncThunk<
  ServerResponseType<IOrder[]>,
  void,
  { rejectValue: ServerResponseType }
>("***orders/getUserOrders***", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ServerResponseType<IOrder[]>>(
      ORDERS_API_ROUTES.GET_USER_ORDERS
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<ServerResponseType>;
    return rejectWithValue(err.response!.data);
  }
});

export const deleteOrderThunk = createAsyncThunk<
  ServerResponseType<{ id: number }>,
  number,
  { rejectValue: ServerResponseType }
>("***orders/deleteOrder***", async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<
      ServerResponseType<{ id: number }>
    >(`${ORDERS_API_ROUTES.GET_ORDER}/${orderId}`);
    return data;
  } catch (error) {
    const err = error as AxiosError<ServerResponseType>;
    return rejectWithValue(err.response!.data);
  }
});
