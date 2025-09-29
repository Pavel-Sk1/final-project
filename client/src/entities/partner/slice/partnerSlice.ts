import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPartnersThunk,
  getPartnerByIdThunk,
  createPartnerThunk,
  updatePartnerThunk,
  deletePartnerThunk,
} from "../api/partnerThunkApi";
import { type PartnersArrayType, type IPartner } from "../model";

type PartnerState = {
  partnersArray: PartnersArrayType;
  partner: IPartner | null;
  loading: boolean;
  error: string | null;
};

const initialState: PartnerState = {
  partnersArray: [],
  partner: null,
  loading: false,
  error: null,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPartnersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPartnersThunk.fulfilled, (state, action) => {
        state.partnersArray = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllPartnersThunk.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Ошибка при получении партнеров";
        state.loading = false;
      })
      .addCase(getPartnerByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPartnerByIdThunk.fulfilled, (state, action) => {
        state.partner = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPartnerByIdThunk.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Ошибка при получении партнера";
        state.loading = false;
      })
      .addCase(createPartnerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPartnerThunk.fulfilled, (state, action) => {
        state.partnersArray.push(action.payload.data);
        state.loading = false;
        state.error = null;
      })
      .addCase(createPartnerThunk.rejected, (state, action) => {
        state.error = action.payload?.message || "Ошибка при создании партнера";
        state.loading = false;
      })
      .addCase(updatePartnerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePartnerThunk.fulfilled, (state, action) => {
        state.partnersArray = state.partnersArray.map((partner) =>
          partner.id === action.payload.data.id ? action.payload.data : partner
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePartnerThunk.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Ошибка при обновлении партнера";
        state.loading = false;
      })
      .addCase(deletePartnerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePartnerThunk.fulfilled, (state, action) => {
        state.partnersArray = state.partnersArray.filter(
          (partner) => partner.id !== action.payload.data.id
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(deletePartnerThunk.rejected, (state, action) => {
        state.error = action.payload?.message || "Ошибка при удалении партнера";
        state.loading = false;
      });
  },
});

export const partnerReducer = partnerSlice.reducer;
