import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createOrderThunk,
  getUserOrdersThunk,
  deleteOrderThunk,
} from "../api/ordersThunkApi";
import type { IOrder } from "../model";
import type { ServerResponseType } from "@/shared";

interface OrdersState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
  createOrderLoading: boolean;
  createOrderError: string | null;
  deleteOrderLoading: boolean;
  deleteOrderError: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  createOrderLoading: false,
  createOrderError: null,
  deleteOrderLoading: false,
  deleteOrderError: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
      state.createOrderError = null;
      state.deleteOrderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user orders
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<ServerResponseType<IOrder[]>>) => {
          state.loading = false;
          state.orders = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ошибка получения заказов";
      })
      // Create order
      .addCase(createOrderThunk.pending, (state) => {
        state.createOrderLoading = true;
        state.createOrderError = null;
      })
      .addCase(
        createOrderThunk.fulfilled,
        (state, action: PayloadAction<ServerResponseType<IOrder>>) => {
          state.createOrderLoading = false;
          state.orders.unshift(action.payload.data);
          state.createOrderError = null;
        }
      )
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.createOrderLoading = false;
        state.createOrderError =
          action.payload?.message || "Ошибка создания заказа";
      })
      // Delete order
      .addCase(deleteOrderThunk.pending, (state) => {
        state.deleteOrderLoading = true;
        state.deleteOrderError = null;
      })
      .addCase(
        deleteOrderThunk.fulfilled,
        (state, action: PayloadAction<ServerResponseType<{ id: number }>>) => {
          state.deleteOrderLoading = false;
          state.orders = state.orders.filter(
            (order) => order.id !== action.payload.data.id
          );
          state.deleteOrderError = null;
        }
      )
      .addCase(deleteOrderThunk.rejected, (state, action) => {
        state.deleteOrderLoading = false;
        state.deleteOrderError =
          action.payload?.message || "Ошибка удаления заказа";
      });
  },
});

export const { clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
