import apiCall from './api';

export const createProduct = async ({ userId, product }) => {
    return await apiCall({
        url: `/api/users/${userId}/products`,
        method: 'POST',
        data: { product },
    });
};

export const fetchProducts = async ({ userId }) => {
    return await apiCall({
        url: `/api/users/${userId}/products`,
        method: 'GET',
    });
};
export const deleteProduct = async ({ userId, productId }) => {
    return await apiCall({
        url: `/api/users/${userId}/products/${productId}`,
        method: 'DELETE',
    });
};
export const updateProduct = async ({ userId, product }) => {
    return await apiCall({
        url: `/api/users/${userId}/products/${product.id}`,
        method: 'PUT',
        data: { product },
    });
};
