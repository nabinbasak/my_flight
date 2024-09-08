import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const alreadyPresentArr = state.items.filter(item => item.fareId === action.payload.fareId)
      if(alreadyPresentArr.length === 0){
        state.items.push(action.payload);
      }else{
        console.log("already exit ",action.payload.fareId)
      }
    },
    removeFromCart: (state, action) => {
      
      state.items = state.items.filter(item => item.fareId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
