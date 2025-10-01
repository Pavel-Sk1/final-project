import { AxiosError } from 'axios';
import type { UserResponseType, ISignUpData, ISignInData } from '../model/';
import { axiosInstance, setAccessToken, type ServerResponseType } from '@/shared/';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { USER_API_ROUTES } from '../model';

// Обновление токенов
export const refreshTokensThunk = createAsyncThunk<ServerResponseType<UserResponseType>, void, { rejectValue: ServerResponseType }>('***user/refreshTokens***', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType<UserResponseType>>(USER_API_ROUTES.REFRESH_TOKENS);
        setAccessToken(data.data.accessToken);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

// Регистрация
export const signUpThunk = createAsyncThunk<ServerResponseType<UserResponseType>, ISignUpData, { rejectValue: ServerResponseType }>('***user/signUp***', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post<ServerResponseType<UserResponseType>>(USER_API_ROUTES.SIGN_UP, userData);        
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

// Вход
export const signInThunk = createAsyncThunk<ServerResponseType<UserResponseType>, ISignInData, { rejectValue: ServerResponseType }>('***user/signIn***', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post<ServerResponseType<UserResponseType>>(USER_API_ROUTES.SIGN_IN, userData);
        setAccessToken(data.data.accessToken);
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});

// Выход
export const signOutThunk = createAsyncThunk<ServerResponseType, void, { rejectValue: ServerResponseType }>('***user/signOut***', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<ServerResponseType>(USER_API_ROUTES.SIGN_OUT);
        setAccessToken('');
        return data;
    } catch (error) {
        const err = error as AxiosError<ServerResponseType>;
        return rejectWithValue(err.response!.data);
    }
});