import { createSlice } from '@reduxjs/toolkit';
import type { IUser } from '../model';
import { refreshTokensThunk, signUpThunk, signInThunk, signOutThunk, updateUserThunk, deleteUserThunk } from '../api/userThunkApi';

type UserState = {
    user: IUser | null;
    userToCreate: IUser | null;
    userToUpdate: IUser | null;
    userToDelete: IUser | null;
    error: string | null;
    loading?: boolean;
    isInitialized?: boolean;
};

const initialState: UserState = {
    user: null,
    userToCreate: null,
    userToUpdate: null,
    userToDelete: null,
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
            .addCase(updateUserThunk.pending, (state) => {
                state.loading = true;
            })            
            .addCase(updateUserThunk.fulfilled, (state, action) => {
                state.userToUpdate = action.payload.data.user;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })
            .addCase(updateUserThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при обновлении пользователя';
                state.loading = false;
                state.isInitialized = true;
            })            
            .addCase(deleteUserThunk.pending, (state) => {
                state.loading = true;
            })            
            .addCase(deleteUserThunk.fulfilled, (state, action) => {
                state.userToDelete = action.payload.data.user;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })            
            .addCase(deleteUserThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при удалении пользователя';
                state.loading = false;
                state.isInitialized = true;
            })
    },
});

export const userReducer = userSlice.reducer;