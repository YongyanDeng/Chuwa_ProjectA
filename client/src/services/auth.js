import apiCall from "./api";

export const signup = async (userData) => {
    const res = await apiCall({
        url: "/api/auth/signup",
        method: "POST",
        userData,
    });
    return res;
};

export const signin = async (userData) => {
    const res = await apiCall({
        url: "/api/auth/signin",
        method: "POST",
        userData,
    });
    return res;
};
