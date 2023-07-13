import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signup, signin } from "services/auth";
import { getAllCartProducts } from "services/user";
import { addError, removeError } from "./errorSlice";

const initialState = {
    isAuthenticated: false,
    user: {},
    cart: [],
    totalPrice: 0,
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

export const getCart = createAsyncThunk("currentUser/getCart", async (data, thunkAPI) => {
    try {
        const { id } = data;
        const cart = await getAllCartProducts(id);
        thunkAPI.dispatch(removeError());
        return cart;
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
            state.cart = [];
            state.totalPrice = 0;
            state.status = "idle";
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        // Sign in
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
        // Sign up
        builder.addCase(signUpUser.fulfilled, (state, action) => {
            state.status = "successed";
        });
        builder.addCase(signUpUser.rejected, (state, action) => {
            state.status = "failed";
        });
        builder.addCase(signUpUser.pending, (state, action) => {
            state.status = "pending";
        });
        // Get cart;
        builder.addCase(getCart.fulfilled, (state, action) => {
            const cart = action.payload;
            state.totalPrice = cart.reduce((total, product) => {
                total += product.price * product.quantity;
                return total;
            }, 0);
            state.cart = cart;
            state.status = "successed";
        });
        builder.addCase(getCart.rejected, (state, action) => {
            state.cart = [];
            state.totalPrice = 0;
            state.status = "failed";
        });
        builder.addCase(getCart.pending, (state, action) => {
            state.status = "pending";
        });
    },
});

export const { setCurrentUser, logOut } = currentUserSlice.actions;
export default currentUserSlice.reducer;
