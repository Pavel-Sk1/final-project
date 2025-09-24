import { createSlice } from '@reduxjs/toolkit';
import { getAllProductImagesThunk } from '../api/productsThunkApi';
import { type IProductImage } from '../model';

type ProductsState = {
  images: IProductImage[];
  loading?: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  images: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductImagesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProductImagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload.data;
      })
      .addCase(getAllProductImagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Ошибка при получении продуктов';
      });
  },
});

export const productsReducer = productsSlice.reducer;


