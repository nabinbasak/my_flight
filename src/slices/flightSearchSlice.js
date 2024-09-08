import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { encryptRequest } from "../cryptoUtils";

const apiKey = "indusAltaR2PSM";
const currency =
  "U2FsdGVkX1/O0sFe9FnokQdTBRP/rRIlcPZEWbzHL9ncZwZzp/Fu/2Jnt0z8ukCALQNDRknKwa5WdmjDRC2XA2a0gz/ZfvHeYTIq7fBZi9P4kQ7KvQYueLB2Rl4puqOTSQyBsbLGPc8cQ9KDZLMVapCruTsJcGzRnaOo1CZksLPMzmNOPqe+ePZk6UJiAUmoDS6p4JvLCmpe0RATiqDh7g==";

export const searchFlights = createAsyncThunk(
  "flights/searchFlights",
  async (searchParams) => {
    const response = await axios.post(
      "https://devadmin.altabooking.com/api/v2/flight/new-flight-search", encryptRequest(searchParams),
      {
        headers: {
          apikey: apiKey,
          currency: currency,
        },
      }
    );
    console.log(response.data.main_data.data)
    // return response.data.main_data.data.flightSearchList.availableFareList; 
    return response.data.main_data.data; 
  }
);

const flightSearchSlice = createSlice({
  name: "flights",
  initialState: {
    flights: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStateFlightSearch: (state, action) => {
      state.flights = []
  }
},
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { clearStateFlightSearch } = flightSearchSlice.actions;
export default flightSearchSlice.reducer;
