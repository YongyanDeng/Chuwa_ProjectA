import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    fetchProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} from 'services/products';
import { removeError, addError } from './errorSlice';

const initialState = {
    products: [],
    status: 'idle',
};

export const fetchProductsAction = createAsyncThunk(
    'products/fetchProducts',
    async (data, thunkAPI) => {
        try {
            const products = await fetchProducts(data);
            thunkAPI.dispatch(removeError());
            return products;
        } catch (error) {
            const { message } = error;
            thunkAPI.dispatch(addError(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createProductAction = createAsyncThunk(
    'products/createProduct',
    async (data, thunkAPI) => {
        try {
            const product = await createProduct(data);
            thunkAPI.dispatch(removeError());
            return product;
        } catch (error) {
            const { message } = error;
            thunkAPI.dispatch(removeError());
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteProductAction = createAsyncThunk(
    'products/deleteProduct',
    async (data, thunkAPI) => {
        try {
            const product = await deleteProduct(data);
            thunkAPI.dispatch(removeError());
            return product;
        } catch (error) {
            const { message } = error;
            thunkAPI.dispatch(removeError());
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateProductAction = createAsyncThunk(
    'products/updateProduct',
    async (data, thunkAPI) => {
        try {
            const product = await updateProduct(data);
            thunkAPI.dispatch(removeError());
            return product;
        } catch (error) {
            const { message } = error;
            thunkAPI.dispatch(removeError());
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProductsAction.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.messages = action.payload;
        });
        builder.addCase(fetchProductsAction.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(fetchProductsAction.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(createProductAction.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.products.push(action.payload);
        });
        builder.addCase(createProductAction.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(createProductAction.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(deleteProductAction.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.products = state.products.filter(
                (product) => product.id !== action.payload.id
            );
        });
        builder.addCase(deleteProductAction.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(deleteProductAction.pending, (state, action) => {
            state.status = 'pending';
        });
        builder.addCase(updateProductAction.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const productIndex = state.prodcuts.findIndex(
                (product) => product.id === action.playload.id
            );
            if (productIndex !== -1) {
                state.status = 'succeeded';
                state.products[productIndex] = action.payload;
            }
        });
        builder.addCase(updateProductAction.rejected, (state, action) => {
            state.status = 'failed';
        });
        builder.addCase(updateProductAction.pending, (state, action) => {
            state.status = 'pending';
        });
    },
});
export default productSlice.reducer;
