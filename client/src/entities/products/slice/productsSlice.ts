import { createSlice } from "@reduxjs/toolkit";
import { createProductThunk, getAllProductImagesThunk } from "../api/productsThunkApi";
import { type IProductImage } from "../model";
import type { IProduct } from "@/entities/info";

type ProductsState = {
  images: IProductImage[];
  product: IProduct | null;
  loading?: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  images: [],
  product: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
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
        state.error =
          action.payload?.message || "Ошибка при получении продуктов";
      })
      .addCase(createProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.product = action.payload.data;
        state.loading = false;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Ошибка при создании продукта";
      });
  },
});

export const productsReducer = productsSlice.reducer;
