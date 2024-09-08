import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: {
    flyingFrom: '',
    flyingTo: '',
    departureDate: '',
    travellers: 1,
    childs : 0,
    infants: 0,
    preferredClass: 'ECONOMY',
    flyingFromName: '',
    flyingToName: '',
  },
  reducers: {
    updateForm(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateForm } = formSlice.actions;
export default formSlice.reducer;
