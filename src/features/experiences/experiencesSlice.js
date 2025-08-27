import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  experiences: [],
  loading: false,
  currentPage: 0,
};

export const experiencesSlice = createSlice({
  name: 'experiences',
  initialState,
  reducers: {
    setExperiences: (state, action) => {
      state.experiences = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    nextPage: (state) => {
      if (state.currentPage < Math.ceil(state.experiences.length / 10) - 1) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 0) {
        state.currentPage -= 1;
      }
    },
  },
});

export const { setExperiences, setLoading, nextPage, prevPage } = experiencesSlice.actions;
export default experiencesSlice.reducer;