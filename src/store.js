import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/formSlice';
import flightSearchReducer from './slices/flightSearchSlice';
import fromAirportReducer from './slices/fromAirportSlice';
import toAirportReducer from './slices/toAirportSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    form: formReducer,
    flightSearch: flightSearchReducer,
    fromAirports: fromAirportReducer,
    toAirports: toAirportReducer,
    cart: cartReducer,
  },
});

export default store;
