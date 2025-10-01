import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPartnersThunk,
  getPartnerByIdThunk,
  createPartnerThunk,
  updatePartnerThunk,
  deletePartnerThunk,
  getAllPartnersWithUserThunk,
} from "../api/partnerThunkApi";
import { type PartnersArrayType, type IPartner, type PartnersArrayWithUserType } from "../model";

type PartnerState = {
  partnersArray: PartnersArrayType;
  partnersArrayWithUser: PartnersArrayWithUserType;
  partner: IPartner | null;
  loading: boolean;
  error: string | null;
};

const initialState: PartnerState = {
  partnersArray: [],
  partnersArrayWithUser: [],
  partner: null,
  loading: false,
  error: null,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    editOnePartner: (state, action) => {
      state.partner = action.payload;
    },
    deleteOnePartner: (state) => {
      state.partner = null;
    },
  },
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
      .addCase(getAllPartnersWithUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPartnersWithUserThunk.fulfilled, (state, action) => {
        state.partnersArrayWithUser = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllPartnersWithUserThunk.rejected, (state, action) => {
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
        state.partnersArrayWithUser = state.partnersArrayWithUser.map((partner) =>
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

        state.partnersArrayWithUser = state.partnersArrayWithUser.filter(
          (partner) => Number(partner.id) !== Number(action.payload.data.id)
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

export const { editOnePartner, deleteOnePartner } = partnerSlice.actions;
export const partnerReducer = partnerSlice.reducer;
