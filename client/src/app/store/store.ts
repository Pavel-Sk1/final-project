import {
  userReducer,
  newsReducer,
  adminReducer,
  productsReducer,
  infoReducer,
  calculationsReducer,
  vacancyReducer,
  categoriesReducer,
  contactReducer,
  partnerReducer,
  ordersReducer,
} from "@/entities";

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    user: userReducer,
    news: newsReducer,
    admin: adminReducer,
    products: productsReducer,
    calculations: calculationsReducer,
    info: infoReducer,
    categories: categoriesReducer,
    vacancy: vacancyReducer,
    contact: contactReducer,
    partner: partnerReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
