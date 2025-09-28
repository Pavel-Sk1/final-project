import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, type ServerResponseType } from '@/shared';
import { type ICreateProduct, type IProductImage, PRODUCTS_API_ROUTES } from '../model';
import type { AxiosError } from 'axios';
import type { IProduct } from '@/entities/info';

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

export const createProductThunk = createAsyncThunk<ServerResponseType<IProduct>, ICreateProduct, { rejectValue: ServerResponseType }>(
  '***products/createProduct***',
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<ServerResponseType<IProduct>>(PRODUCTS_API_ROUTES.LIST, product);
      return data;
    } catch (error) {
      const err = error as AxiosError<ServerResponseType>;
      return rejectWithValue(err.response!.data);
    }
  }
);


