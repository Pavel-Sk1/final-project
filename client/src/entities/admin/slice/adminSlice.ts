import { createSlice } from "@reduxjs/toolkit";
import { getAllAdminNewsThunk, getNewsByIdThunk, createNewsThunk, updateNewsThunk, deleteNewsThunk, getAllProductsThunk, getProductByIdThunk, updateProductThunk, createProductThunk, deleteProductThunk } from "../api/adminThunkApi";
import { type IAdminNews, type AdminNewsArrayType, type IAdminProduct, type AdminProductArrayType } from "../model";


type AdminState = {
    newsArray: AdminNewsArrayType;
    news: IAdminNews | null;
    productArray: AdminProductArrayType;
    product: IAdminProduct | null;
    error: string | null;
    loading: boolean;    
}

const initialState: AdminState = {
    newsArray: [],
    news: null,
    productArray: [],
    product: null,
    error: null,
    loading: false,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllAdminNewsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllAdminNewsThunk.fulfilled, (state, action) => {
                state.newsArray = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllAdminNewsThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при получении новости';
                state.loading = false;
            })
            .addCase(getNewsByIdThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getNewsByIdThunk.fulfilled, (state, action) => {
                state.news = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getNewsByIdThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при получении новости';
                state.loading = false;
            })
            .addCase(createNewsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createNewsThunk.fulfilled, (state, action) => {
                state.newsArray.push(action.payload.data);
                state.loading = false;
                state.error = null;
            })
            .addCase(createNewsThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при создании новости';
                state.loading = false;
            })
            .addCase(updateNewsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateNewsThunk.fulfilled, (state, action) => {
                state.newsArray = state.newsArray.map(news => news.id === action.payload.data.id ? action.payload.data : news);
                state.loading = false;
                state.error = null;
            })
            .addCase(updateNewsThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при обновлении новости';
                state.loading = false;
            })
            .addCase(deleteNewsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteNewsThunk.fulfilled, (state, action) => {                
                state.newsArray = state.newsArray.filter(news => Number(news.id) !== Number(action.payload.data.id));
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteNewsThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при удалении новости';
                state.loading = false;
            })
            .addCase(getAllProductsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllProductsThunk.fulfilled, (state, action) => {
                state.productArray = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllProductsThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при получении продуктов';
                state.loading = false;
            })
            .addCase(getProductByIdThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductByIdThunk.fulfilled, (state, action) => {
                state.product = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getProductByIdThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при получении продукта';
                state.loading = false;
            })
            .addCase(createProductThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProductThunk.fulfilled, (state, action) => {
                state.productArray.push(action.payload.data);
                state.loading = false;
                state.error = null;
            })
            .addCase(createProductThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при создании продукта';
                state.loading = false;
            })            
            .addCase(updateProductThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProductThunk.fulfilled, (state, action) => {
                state.productArray = state.productArray.map(product => product.id === action.payload.data.id ? action.payload.data : product);
                state.loading = false;
                state.error = null;
            })
            
            .addCase(updateProductThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при обновлении продукта';
                state.loading = false;
            })
            .addCase(deleteProductThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProductThunk.fulfilled, (state, action) => {
                state.productArray = state.productArray.filter(product => Number(product.id) !== Number(action.payload.data.id));
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteProductThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при удалении продукта';
                state.loading = false;
            })
    }
})

export const adminReducer = adminSlice.reducer;