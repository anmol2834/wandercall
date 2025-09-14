import { createSlice } from '@reduxjs/toolkit';

// Get theme from localStorage or default to 'dark'
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('wandercall-theme');
    return savedTheme || 'dark';
  }
  return 'dark';
};

const initialState = {
  mode: getInitialTheme(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('wandercall-theme', state.mode);
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('wandercall-theme', action.payload);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;