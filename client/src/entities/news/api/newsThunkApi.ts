import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, type ServerResponseType } from '@/shared';
import { type INewsItem, NEWS_API_ROUTES } from '../model'; 
import type { AxiosError } from 'axios';

export const getAllNewsThunk = createAsyncThunk<ServerResponseType<INewsItem[]>, void, { rejectValue: ServerResponseType }>(
  '***news/fetchList***',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<ServerResponseType<INewsItem[]>>(NEWS_API_ROUTES.LIST);
      return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
  }
);

