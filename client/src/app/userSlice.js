import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signup, signin } from "services/auth";
import { addError, removeError } from "./errorSlice";

const initialState = {
    isAuthenticated: false,
    user: {},
    status: "idle",
};

export const signUpUser = createAsyncThunk("currentUser/signUpUser", async (data, thunkAPI) => {
    try {
        const newUser = await signup(data);
        thunkAPI.dispatch(removeError());
        return newUser;
    } catch (err) {
        thunkAPI.dispatch(addError(err.message));
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const signInUser = createAsyncThunk("currentUser/signInUser", async (data, thunkAPI) => {
    try {
        const user = await signin(data);
        localStorage.setItem("token", user.token);
        thunkAPI.dispatch(removeError());
        return user;
    } catch (err) {
        thunkAPI.dispatch(addError(err.message));
        return thunkAPI.rejectWithValue(err.message);
    }
});

const currentUserSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.isAuthenticated = !!Object.keys(action.payload).length;
            state.user = action.payload;
        },
        logOut: (state, action) => {
            state.isAuthenticated = false;
            state.user = {};
            state.status = "idle";
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signInUser.fulfilled, (state, action) => {
            state.isAuthenticated = !!Object.keys(action.payload).length;
            state.user = action.payload;
            state.status = "successed";
        });
        builder.addCase(signInUser.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.user = {};
            state.status = "failed";
        });
        builder.addCase(signInUser.pending, (state, action) => {
            state.status = "pending";
        });
        builder.addCase(signUpUser.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(signUpUser.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(signUpUser.pending, (state, action) => {
            state.status = "pending";
        });
    },
});

export const { setCurrentUser, logOut } = currentUserSlice.actions;
export default currentUserSlice.reducer;
