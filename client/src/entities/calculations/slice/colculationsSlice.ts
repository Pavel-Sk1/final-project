import { createSlice } from "@reduxjs/toolkit";
import { getOrdersByDateThunk } from "../api/calculationsThunkApi";
import { type IOrder } from "../model";

type CalculationsState = {
    orders: IOrder[];
    error: string | null;
    loading: boolean;
}

const initialState: CalculationsState = {
    orders: [],
    error: null,
    loading: false,
};

const calculationsSlice = createSlice({
    name: 'calculations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOrdersByDateThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrdersByDateThunk.fulfilled, (state, action) => {
                state.orders = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getOrdersByDateThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при получении заказов';
                state.loading = false;
            })
        }
    });

    export const calculationsReducer = calculationsSlice.reducer;