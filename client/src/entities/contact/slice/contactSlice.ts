import { createSlice } from "@reduxjs/toolkit";
import { getAllContactsThunk } from "../api/contactThunkApi";
import { type MainContact } from "../model";

type ContactState = {
    contacts: MainContact[];
    loading: boolean;
    error: string | null;
}

const initialState: ContactState = {
    contacts: [],
    loading: false,
    error: null,
}

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllContactsThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllContactsThunk.fulfilled, (state, action) => {
            state.contacts = action.payload.data;
            state.loading = false;
        });
        builder.addCase(getAllContactsThunk.rejected, (state, action) => {
            state.error = action.payload?.message || null;
            state.loading = false;
        });
    }
});

export const contactReducer = contactSlice.reducer;