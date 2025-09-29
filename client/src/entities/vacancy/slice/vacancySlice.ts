import { createSlice } from "@reduxjs/toolkit";
import { getAllVacanciesThunk } from "../api/vacancyThunkApi";
import { type IVacancy } from "../model";  

type VacancyState = {
    list: IVacancy[];
    loading: boolean;
    error: string | null;
}

const initialState: VacancyState = {
    list:[],
    loading: false,
    error: null,
}

const vacancySlice = createSlice({
    name: 'vacancy',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllVacanciesThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllVacanciesThunk.fulfilled, (state, action) => {
            state.list = action.payload.data;
            state.loading = false;
        });
        builder.addCase(getAllVacanciesThunk.rejected, (state, action) => {
            state.error = action.payload?.message || null;
            state.loading = false;
        });
    }
});

export const vacancyReducer = vacancySlice.reducer;

