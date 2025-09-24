import { configureStore } from "@reduxjs/toolkit";
import { userReducer, adminReducer } from "@/entities";

// Конфигурация store
export const store = configureStore({
    reducer: {
        user: userReducer,        
        admin: adminReducer,
    },
});

// Типы состояния и диспатча
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;