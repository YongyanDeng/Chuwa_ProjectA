import apiCall from "./api";

export const signup = async (data) => {
    const res = await apiCall({
        url: "/api/auth/signup",
        method: "POST",
        data,
    });
    return res;
};

export const signin = async (data) => {
    const res = await apiCall({
        url: "/api/auth/signin",
        method: "POST",
        data,
    });
    return res;
};
