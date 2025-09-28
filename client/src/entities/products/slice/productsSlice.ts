import { createSlice } from "@reduxjs/toolkit";
import { createProductThunk, getAllProductImagesThunk, getAllProductsThunk } from "../api/productsThunkApi";
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
      });
  },
});

export const productsReducer = productsSlice.reducer;
