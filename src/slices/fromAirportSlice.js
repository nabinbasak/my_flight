import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { encryptRequest } from '../cryptoUtils';

const initialState = {
  airports: [],
  loading: false,
  error: null,
};

const fromAirportSlice = createSlice({
  name: 'fromAirports',
  initialState,
  reducers: {
    fetchAirportsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAirportsSuccess(state, action) {
      state.loading = false;
      state.airports = (action.payload.length > 0 ) ? action.payload : state.airports
    },
    fetchAirportsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAirportsStart, fetchAirportsSuccess, fetchAirportsFailure } = fromAirportSlice.actions;

const apiKey = "indusAltaR2PSM";
const currency = "U2FsdGVkX1/O0sFe9FnokQdTBRP/rRIlcPZEWbzHL9ncZwZzp/Fu/2Jnt0z8ukCALQNDRknKwa5WdmjDRC2XA2a0gz/ZfvHeYTIq7fBZi9P4kQ7KvQYueLB2Rl4puqOTSQyBsbLGPc8cQ9KDZLMVapCruTsJcGzRnaOo1CZksLPMzmNOPqe+ePZk6UJiAUmoDS6p4JvLCmpe0RATiqDh7g==";

const modifiyData = (data) => {
  return data.map((i) => ({
    ...i,
    name: i.short_name,
    code: i.iata
  }));
}

export const fetchAirports = (query) => async (dispatch) => {
  dispatch(fetchAirportsStart());
  try {
    const requestData = encryptRequest({ search_key: query });
    const response = await axios.post(
      'https://devadmin.altabooking.com/api/v2/flight/search-flight-airport',
      requestData,
      {
        headers: {
          'apikey': apiKey,
          'currency': currency,
        },
      }
    );
    console.log("fetchAirportsSuccess",response.data.main_data.data)
    dispatch(fetchAirportsSuccess(modifiyData(response.data.main_data.data)));
  } catch (error) {
    dispatch(fetchAirportsFailure(error.message));
  }
};

export default fromAirportSlice.reducer;
