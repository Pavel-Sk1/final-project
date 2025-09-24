import { userReducer, newsReducer, adminReducer, productsReducer } from "@/entities";
import { configureStore } from "@reduxjs/toolkit";

// Конфигурация store
export const store = configureStore({
    reducer: {
        user: userReducer,
        news: newsReducer,      
        admin: adminReducer,
        products: productsReducer,

    },
});

// Типы состояния и диспатча
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;