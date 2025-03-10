import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type DisplayId = 1 | 2 | 3 | 4;


const initialState: Array<DisplayId> = []

export const displaySlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggleDisplay: (state, action: PayloadAction<DisplayId>) => {
        const displayId = action.payload;
        const index = state.indexOf(displayId);
        let newArr = state.slice()

        if (state.includes(displayId)) {
            newArr.splice(index,1)
            state = newArr
        } else {
            newArr = [...newArr, displayId]
        }
        console.log(newArr)
        return newArr
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleDisplay } = displaySlice.actions;

export default displaySlice.reducer;
