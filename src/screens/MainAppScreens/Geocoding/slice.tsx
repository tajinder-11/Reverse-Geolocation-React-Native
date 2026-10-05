import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface GeocodingState {
  loading: boolean;
}

const initialState: GeocodingState = {
  loading: false,
};

const geocodingSlice = createSlice({
  name: 'geocoding',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {setLoading} = geocodingSlice.actions;
export const geocodingReducer = geocodingSlice.reducer;