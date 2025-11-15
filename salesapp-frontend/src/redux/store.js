import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./slices/orderSlice";
import clientReducer from "./slices/clientSlice";

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    clients: clientReducer,
  }
});
