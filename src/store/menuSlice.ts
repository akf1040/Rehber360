import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { menuService } from '../services/menuService';

export interface MenuItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk - Firestore'dan menü çekme
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (userRole: string) => {
    const items = await menuService.getMenuItems(userRole);
    return items;
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearMenu: (state) => {
      state.items = [];
      state.error = null;
    },
    updateMenuBadge: (state, action: PayloadAction<{ route: string; badge: number }>) => {
      const item = state.items.find(item => item.route === action.payload.route);
      if (item) {
        item.badge = action.payload.badge;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Menü yüklenirken hata oluştu';
      });
  },
});

export const { clearMenu, updateMenuBadge } = menuSlice.actions;
export default menuSlice.reducer; 