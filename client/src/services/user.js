import apiCall from "./api";

export const getAllCartProducts = async (userId) => {
    const res = await apiCall({
        url: `/api/users/${userId}/cart`,
        method: "GET",
    });
    return res;
};
