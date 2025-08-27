import { createSlice } from '@reduxjs/toolkit';

const mockExperiences = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Amazing Experience ${i + 1}`,
  description: 'Discover something extraordinary and create unforgettable memories.',
  image: `https://picsum.photos/400/300?random=${i + 1}`,
  rating: (4 + Math.random()).toFixed(1),
  price: Math.floor(Math.random() * 15000) + 2500,
  category: ['Adventure', 'Culture', 'Food', 'Nature', 'Art'][Math.floor(Math.random() * 5)],
}));

const initialState = {
  experiences: mockExperiences,
  currentPage: 0,
  loading: false,
  itemsPerPage: 9,
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
      const totalPages = Math.ceil(state.experiences.length / state.itemsPerPage);
      if (state.currentPage < totalPages - 1) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 0) {
        state.currentPage -= 1;
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setExperiences, setLoading, nextPage, prevPage, setCurrentPage } = experiencesSlice.actions;
export default experiencesSlice.reducer;