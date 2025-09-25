import { createSlice } from '@reduxjs/toolkit';
import { getProductsThunk } from '../api/infoThunkApi';
import { type IProduct } from '../model';

type InfoState = {
  products: IProduct[];
  loading?: boolean;
  error: string | null;
};

const initialState: InfoState = {
  products: [],
  loading: false,
  error: null,
};

const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
      })
      .addCase(getProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Ошибка при получении продуктов';
      });
  },
});

export const infoReducer = infoSlice.reducer;
