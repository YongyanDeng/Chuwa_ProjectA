import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    error: null,
};

const errorSlice = createSlice({
    name: "errors",
    initialState,
    reducers: {
        addError: (state, action) => {
            state.message = action.payload;
        },
        removeError: (state, action) => {
            state.message = null;
        },
    },
});

export const { addError, removeError } = errorSlice.actions;
export default errorSlice.reducer;
