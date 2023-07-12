import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addError, removeError } from "./errorSlice";

const initalState = {
    user: {},
    state: "idle",
    isAuthenticated: false,
};

export const authUser = createAsyncThunk("users/authUser", async (data, thunkAPI) => {});
