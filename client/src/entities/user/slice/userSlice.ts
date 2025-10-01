import { createSlice } from '@reduxjs/toolkit';
import type { IUser } from '../model';
import { refreshTokensThunk, signUpThunk, signInThunk, signOutThunk } from '../api/userThunkApi';

type UserState = {
    user: IUser | null;
    userToCreate: IUser | null;
    error: string | null;
    loading?: boolean;
    isInitialized?: boolean;
};

const initialState: UserState = {
    user: null,
    userToCreate: null,
    error: null,
    loading: false,
    isInitialized: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    
    reducers: {},
    
    extraReducers: (builder) => {

        builder
            .addCase(refreshTokensThunk.pending, (state) => {
                state.loading = true;
            })
            
            .addCase(refreshTokensThunk.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })
            
            .addCase(refreshTokensThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при обновлении токенов';
                state.loading = false;
                state.isInitialized = true;
            })
            
            .addCase(signUpThunk.pending, (state) => {
                state.loading = true;
            })
            
            .addCase(signUpThunk.fulfilled, (state, action) => {                
                state.userToCreate = action.payload.data.user;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })
            
            .addCase(signUpThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при регистрации';
                state.loading = false;
                state.isInitialized = true;
            })
            
            .addCase(signInThunk.pending, (state) => {
                state.loading = true;
            })
            
            .addCase(signInThunk.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })
            
            .addCase(signInThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при входе';
                state.loading = false;
                state.isInitialized = true;
            })
            
            .addCase(signOutThunk.pending, (state) => {
                state.loading = true;
            })
            
            .addCase(signOutThunk.fulfilled, (state) => {
                state.user = null;
            })
            
            .addCase(signOutThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при выходе';
                state.loading = false;
                state.isInitialized = true;
            })
    },
});

export const userReducer = userSlice.reducer;