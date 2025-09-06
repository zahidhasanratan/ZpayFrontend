import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { landingApi } from "../features/api/landingApi";
import { walletApi } from "../features/api/walletApi";
import { agentApi } from "../features/api/agentApi";
import { adminApi } from "../features/api/adminApi";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [landingApi.reducerPath]: landingApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (gDM) =>
    gDM().concat(
      landingApi.middleware,
      walletApi.middleware,
      agentApi.middleware,
      adminApi.middleware
    ),
});

// Optional but recommended: enables refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
