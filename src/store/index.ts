import { configureStore } from "@reduxjs/toolkit";
import { landingApi } from "../features/api/landingApi";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ add
    [landingApi.reducerPath]: landingApi.reducer,
  },
  middleware: (gDM) => gDM().concat(landingApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
