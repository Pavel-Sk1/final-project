import { createSlice } from '@reduxjs/toolkit';
import { getAllNewsThunk } from '../api/newsThunkApi';
import { type INewsItem } from '../model';

type NewsState = {
  list: INewsItem[];
  loanding?: boolean;
  error: string | null;
};

const initialState: NewsState = {
  list: [],
  loanding: false,
  error: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNewsThunk.pending, (state) => {
        state.loanding = true;
      })
      .addCase(getAllNewsThunk.fulfilled, (state, action) => {
        state.loanding = false;
        state.list = action.payload.data;
      })
      .addCase(getAllNewsThunk.rejected, (state, action) => {
        state.loanding = false;
        state.error = action.payload?.message || 'Ошибка при получении задач';
      });
  },
});

export const newsReducer = newsSlice.reducer;


