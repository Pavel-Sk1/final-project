import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, type ServerResponseType } from "@/shared";
import {
  type ICreateProduct,
  type IProductArrayType,
  type IProductImage,
  PRODUCTS_API_ROUTES,
  type IProduct,
} from "../model";
import type { AxiosError } from "axios";

export const getAllProductImagesThunk = createAsyncThunk<
  ServerResponseType<IProductImage[]>,
  void,
  { rejectValue: ServerResponseType }
>("***products/fetchImages***", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<
      ServerResponseType<IProductImage[]>
    >(PRODUCTS_API_ROUTES.LIST);
    return data;
  } catch (error) {
    const err = error as AxiosError<ServerResponseType>;
    return rejectWithValue(err.response!.data);
  }
});

export const getAllProductsThunk = createAsyncThunk<
  ServerResponseType<IProductArrayType>,
  void,
  { rejectValue: ServerResponseType }
>("***products/getAllProducts***", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<
      ServerResponseType<IProductArrayType>
    >(PRODUCTS_API_ROUTES.ALL);
    return data;
  } catch (error) {
    const err = error as AxiosError<ServerResponseType>;
    return rejectWithValue(err.response!.data);
  }
});

export const createProductThunk = createAsyncThunk<
  ServerResponseType<IProduct>,
  ICreateProduct,
  { rejectValue: ServerResponseType }
>("***products/createProduct***", async (product, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ServerResponseType<IProduct>>(
      PRODUCTS_API_ROUTES.LIST,
      product
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<ServerResponseType>;
    return rejectWithValue(err.response!.data);
  }
});
