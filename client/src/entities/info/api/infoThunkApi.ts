import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, type ServerResponseType } from '@/shared';
import { type IProduct, INFO_API_ROUTES } from '../model';
import type { AxiosError } from 'axios';

export const getProductsThunk = createAsyncThunk<ServerResponseType<IProduct[]>, void, { rejectValue: ServerResponseType }>(
  '***info/fetchProducts***',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<ServerResponseType<IProduct[]>>(INFO_API_ROUTES.PRODUCTS);
      return data;
    } catch (error) {
      const err = error as AxiosError<ServerResponseType>;
      return rejectWithValue(err.response!.data);
    }
  }
);
