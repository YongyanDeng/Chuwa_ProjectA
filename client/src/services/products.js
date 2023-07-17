import apiCall from "./api";

export const createProduct = async ({ id, product }) => {
    return await apiCall({
        url: `/api/users/${id}/products`,
        method: "POST",
        data: product,
    });
};

export const fetchProducts = async ({ id }) => {
    return await apiCall({
        url: `/api/users/${id}/products`,
        method: "GET",
    });
};

// export const fetchProducts = async () => {
//     return await apiCall({
//         url: `/api/products`,
//         method: 'GET',
//     });
// };
export const fetchOneProduct = async (productId) => {
    return await apiCall({
        url: `/api/products/${productId}`,
        method: "GET",
    });
};
export const deleteProduct = async ({ id, productId }) => {
    return await apiCall({
        url: `/api/users/${id}/products/${productId}`,
        method: "DELETE",
    });
};
export const updateProduct = async ({ id, productId, product }) => {
    return await apiCall({
        url: `/api/users/${id}/products/${productId}`,
        method: "PUT",
        data: product,
    });
};
