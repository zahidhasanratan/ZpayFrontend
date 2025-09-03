import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Role = "user" | "agent" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

const KEY = "zpay_auth";

// Load persisted auth from localStorage
const load = (): AuthState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { token: null, user: null };
    return JSON.parse(raw) as AuthState;
  } catch {
    return { token: null, user: null };
  }
};

// Save auth state to localStorage
const save = (s: AuthState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // fail silently
  }
};

const initialState: AuthState = load();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthState>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      save(state);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      save(state);
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
