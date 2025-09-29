import { createSlice } from "@reduxjs/toolkit";
import { getAllCategoriesThunk } from "../api/categoriesThunkApi";
import { type CategoriesArrayType } from "../model";

type CategoriesState = {
    categoriesArray: CategoriesArrayType;
    error: string | null;
    loading: boolean;
}

const initialState: CategoriesState = {
    categoriesArray: [],
    error: null,
    loading: false,
}

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCategoriesThunk.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllCategoriesThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.categoriesArray = action.payload.data;
        })
        .addCase(getAllCategoriesThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Ошибка при получении категорий";
        });
    }
});

export const categoriesReducer = categoriesSlice.reducer;