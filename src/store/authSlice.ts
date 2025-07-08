import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<{isAuthenticated: boolean; user: User | null}>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setAuthenticated, setUser, signOut } = authSlice.actions;
export default authSlice.reducer; 