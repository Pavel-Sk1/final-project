import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, type ServerResponseType } from '@/shared';
import { type IProductImage, PRODUCTS_API_ROUTES } from '../model';
import type { AxiosError } from 'axios';

export const getAllProductImagesThunk = createAsyncThunk<ServerResponseType<IProductImage[]>, void, { rejectValue: ServerResponseType }>(
  '***products/fetchImages***',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<ServerResponseType<IProductImage[]>>(PRODUCTS_API_ROUTES.LIST);
      return data;
    } catch (error) {
      const err = error as AxiosError<ServerResponseType>;
      return rejectWithValue(err.response!.data);
    }
  }
);


