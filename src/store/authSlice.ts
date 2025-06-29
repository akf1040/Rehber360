import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  userRole: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userRole: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUserRole, setAuthenticated } = authSlice.actions;
export default authSlice.reducer; 