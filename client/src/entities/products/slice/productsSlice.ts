import { createSlice } from "@reduxjs/toolkit";
import { createProductThunk, deleteProductThunk, getAllProductImagesThunk, getAllProductsThunk, updateFullProductThunk } from "../api/productsThunkApi";
import { type IProductArrayType, type IProductImage, type IProduct } from "../model";

type ProductsState = {
  images: IProductImage[];
  product: IProduct | null;
  products: IProductArrayType;
  loading?: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  images: [],
  product: null,
  products: [],
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
      .addCase(getAllProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
      })
      .addCase(createProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Ошибка при создании продукта";
      })
      .addCase(updateFullProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFullProductThunk.fulfilled, (state, action) => {
        state.products = state.products.map(product => product.id === action.payload.data.id ? action.payload.data : product);
        state.loading = false;
      })
      .addCase(updateFullProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ошибка при обновлении продукта";
      })
      .addCase(deleteProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product.id !== action.payload.data.id);
        state.loading = false;
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ошибка при удалении продукта";
      })
  },
});

export const productsReducer = productsSlice.reducer;
