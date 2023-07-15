import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signup, signin, updatePassword as up } from 'services/auth';
import {
    getAllCartProducts,
    changeCartProductQuantity,
    removeProductInCart,
    checkout,
} from 'services/user';
import { addError, removeError } from './errorSlice';

const initialState = {
    isAuthenticated: false,
    user: {},
    cart: [],
    totalPrice: 0,
    status: 'idle',
};

export const signUpUser = createAsyncThunk(
    'currentUser/signUpUser',
    async (data, thunkAPI) => {
        try {
            const newUser = await signup(data);
            thunkAPI.dispatch(removeError());
            return newUser;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const signInUser = createAsyncThunk(
    'currentUser/signInUser',
    async (data, thunkAPI) => {
        try {
            const user = await signin(data);
            localStorage.setItem('token', user.token);
            thunkAPI.dispatch(removeError());
            return user;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const updatePassword = createAsyncThunk(
    'currentUser/updatePassword',
    async (data, thunkAPI) => {
        try {
            const user = await up(data);
            thunkAPI.dispatch(removeError());
            return user;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const getCart = createAsyncThunk(
    'currentUser/getCart',
    async (data, thunkAPI) => {
        try {
            const { id } = data;
            const cart = await getAllCartProducts(id);
            thunkAPI.dispatch(removeError());
            return cart;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const updateCartProduct = createAsyncThunk(
    'currentUser/updateCartProduct',
    async (data, thunkAPI) => {
        try {
            const res = await changeCartProductQuantity(data);
            thunkAPI.dispatch(removeError());
            return res;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const removeCartProduct = createAsyncThunk(
    'currentUser/removeProductInCart',
    async (data, thunkAPI) => {
        try {
            const res = await removeProductInCart(data);
            thunkAPI.dispatch(removeError());
            return res;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const checkoutCart = createAsyncThunk(
    'currentUser/checkout',
    async (data, thunkAPI) => {
        try {
            const res = await checkout(data);
            thunkAPI.dispatch(removeError());
            return res;
        } catch (err) {
            thunkAPI.dispatch(addError(err.message));
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

const currentUserSlice = createSlice({
    name: 'currentUser',
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
            state.status = 'idle';
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        // Sign in
        builder.addCase(signInUser.fulfilled, (state, action) => {
            state.isAuthenticated = !!Object.keys(action.payload).length;
            state.user = action.payload;
            state.status = 'successed';
        });
        builder.addCase(signInUser.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.user = {};
            state.status = 'failed';
        });
        builder.addCase(signInUser.pending, (state, action) => {
            state.status = 'pending';
        });

        // Sign up
        builder.addCase(signUpUser.fulfilled, (state, action) => {
            state.status = 'successed';
        });
        builder.addCase(signUpUser.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(signUpUser.pending, (state, action) => {
            state.status = 'pending';
        });

        // Update Password
        builder.addCase(updatePassword.fulfilled, (state, action) => {
            state.status = 'successed';
        });
        builder.addCase(updatePassword.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(updatePassword.pending, (state, action) => {
            state.status = 'pending';
        });

        /**
         * Get all products in user's cart
         * @return [Array(Oject)] current cart
         */
        builder.addCase(getCart.fulfilled, (state, action) => {
            const cart = action.payload;
            state.totalPrice = cart.reduce((total, product) => {
                total += product.price * product.quantity;
                return total;
            }, 0);
            state.cart = cart;
            state.status = 'successed';
        });
        builder.addCase(getCart.rejected, (state, action) => {
            state.cart = [];
            state.totalPrice = 0;
            state.status = 'failed';
        });
        builder.addCase(getCart.pending, (state, action) => {
            state.status = 'pending';
        });

        /**
         * Update a product quantity in cart
         * @return [Object{productId: quantity}] current cart
         */
        builder.addCase(updateCartProduct.fulfilled, (state, action) => {
            const cart = action.payload.cart;
            var total = 0;
            state.cart.map((product) => {
                product.quantity = cart[product.id];
                total += product.quantity * product.price;
                return product;
            });
            state.totalPrice = total;
            state.status = 'successed';
        });
        builder.addCase(updateCartProduct.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(updateCartProduct.pending, (state, action) => {
            state.status = 'pending';
        });

        // Remove product from user's cart, return the current cart
        builder.addCase(removeCartProduct.fulfilled, (state, action) => {
            const cart = action.payload.cart;
            console.log(cart);
            state.totalPrice = cart.reduce((total, product) => {
                total += product.price * product.quantity;
                return total;
            }, 0);
            state.cart = cart;
            state.status = 'successed';
        });
        builder.addCase(removeCartProduct.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(removeCartProduct.pending, (state, action) => {
            state.status = 'pending';
        });

        /**
         * Checkout all products in cart
         * @return [Ojbect] notification message
         */
        builder.addCase(checkoutCart.fulfilled, (state, action) => {
            console.log(action.payload);

            state.cart = [];
            state.totalPrice = 0;
            state.status = 'successed';
        });
        builder.addCase(checkoutCart.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(checkoutCart.pending, (state, action) => {
            state.status = 'pending';
        });
    },
});

export const { setCurrentUser, logOut } = currentUserSlice.actions;
export default currentUserSlice.reducer;
