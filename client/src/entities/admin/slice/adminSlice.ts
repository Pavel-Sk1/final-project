import { createSlice } from "@reduxjs/toolkit";
import { getAllInformationThunk, getInformationByIdThunk, createInformationThunk, updateInformationThunk, deleteInformationThunk, getAllProductsThunk, getProductByIdThunk, updateProductThunk } from "../api/adminThunkApi";
import { type IAdminInformation, type AdminInfoArrayType, type IAdminProduct, type AdminProductArrayType } from "../model";

type AdminState = {
    infoArray: AdminInfoArrayType;
    info: IAdminInformation | null;
    productArray: AdminProductArrayType;
    product: IAdminProduct | null;
    error: string | null;
    loading: boolean;    
}

const initialState: AdminState = {
    infoArray: [],
    info: null,
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
            .addCase(getAllInformationThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllInformationThunk.fulfilled, (state, action) => {
                state.infoArray = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllInformationThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при получении информации';
                state.loading = false;
            })
            .addCase(getInformationByIdThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getInformationByIdThunk.fulfilled, (state, action) => {
                state.info = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getInformationByIdThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при получении информации';
                state.loading = false;
            })
            .addCase(createInformationThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createInformationThunk.fulfilled, (state, action) => {
                state.infoArray.push(action.payload.data);
                state.loading = false;
                state.error = null;
            })
            .addCase(createInformationThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при создании информации';
                state.loading = false;
            })
            .addCase(updateInformationThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateInformationThunk.fulfilled, (state, action) => {
                state.infoArray = state.infoArray.map(info => info.id === action.payload.data.id ? action.payload.data : info);
                state.loading = false;
                state.error = null;
            })
            .addCase(updateInformationThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при обновлении информации';
                state.loading = false;
            })
            .addCase(deleteInformationThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteInformationThunk.fulfilled, (state, action) => {
                state.infoArray = state.infoArray.filter(info => info.id !== action.payload.data.id);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteInformationThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при удалении информации';
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
    }
})

export const adminReducer = adminSlice.reducer;