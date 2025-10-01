import { createSlice } from '@reduxjs/toolkit';
import type { IUser } from '../model';
import { refreshTokensThunk, signUpThunk, signInThunk, signOutThunk } from '../api/userThunkApi';

// Тип состояния пользователя (тип всего слайса)
type UserState = {
    user: IUser | null;
    userToCreate: IUser | null;
    error: string | null;
    loading?: boolean;
    isInitialized?: boolean;
};

// Начальное состояние пользователя
const initialState: UserState = {
    user: null,
    userToCreate: null,
    error: null,
    loading: false,
    isInitialized: false,
};

// Создание слайса пользователя
const userSlice = createSlice({
    name: 'user',
    initialState,
    // синхронные редюсеры
    reducers: {},
    // асинхронные редюсеры
    extraReducers: (builder) => {

        builder
            .addCase(refreshTokensThunk.pending, (state) => {
                state.loading = true;
            })
            // Успешное обновление токенов
            .addCase(refreshTokensThunk.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })
            // Ошибка при обновлении токенов
            .addCase(refreshTokensThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при обновлении токенов';
                state.loading = false;
                state.isInitialized = true;
            })
            // Регистрация (ожидание)
            .addCase(signUpThunk.pending, (state) => {
                state.loading = true;
            })
            // Успешная регистрация
            .addCase(signUpThunk.fulfilled, (state, action) => {                
                state.userToCreate = action.payload.data.user;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })
            // Ошибка при регистрации
            .addCase(signUpThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при регистрации';
                state.loading = false;
                state.isInitialized = true;
            })
            // Вход (ожидание)
            .addCase(signInThunk.pending, (state) => {
                state.loading = true;
            })
            // Успешный вход
            .addCase(signInThunk.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })
            // Ошибка при входе
            .addCase(signInThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при входе';
                state.loading = false;
                state.isInitialized = true;
            })
            // Выход (ожидание)
            .addCase(signOutThunk.pending, (state) => {
                state.loading = true;
            })
            // Успешный выход
            .addCase(signOutThunk.fulfilled, (state) => {
                state.user = null;
            })
            // Ошибка при выходе
            .addCase(signOutThunk.rejected, (state, action) => {
                state.error = action.payload?.message || 'Ошибка при выходе';
                state.loading = false;
                state.isInitialized = true;
            })
    },
});

// Редьюсер пользователя
export const userReducer = userSlice.reducer;