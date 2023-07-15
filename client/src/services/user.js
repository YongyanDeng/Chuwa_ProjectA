import apiCall from "./api";

export const getAllCartProducts = async (userId) => {
    const res = await apiCall({
        url: `/api/users/${userId}/cart`,
        method: "GET",
    });
    return res;
};

export const changeCartProductQuantity = async ({ userId, productId, curQuantity }) => {
    const res = await apiCall({
        url: `/api/users/${userId}/cart/${productId}`,
        method: "PUT",
        data: { quantity: curQuantity },
    });
    return res;
};

export const removeProductInCart = async ({ userId, productId }) => {
    const res = await apiCall({
        url: `api/users/${userId}/cart/${productId}`,
        method: "DELETE",
    });
    return res;
};

export const checkout = async ({ id, charge }) => {
    const res = await apiCall({
        url: `api/users/${id}/cart/checkout`,
        method: "POST",
        data: { charge },
    });
    return res;
};
