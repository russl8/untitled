import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type DisplayId = 1 | 2 | 3 | 4;
export interface DashboardDisplayState {
  1: boolean;
  2: boolean;
  3: boolean;
  4: boolean;
}

const initialState: DashboardDisplayState = {
  1: true,
  2: false,
  3: false,
  4: false,
};

export const displaySlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggleDisplay: (state, action: PayloadAction<DisplayId>) => {
        console.log(action.payload)
      state[action.payload] = !state[action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleDisplay } = displaySlice.actions;

export default displaySlice.reducer;
