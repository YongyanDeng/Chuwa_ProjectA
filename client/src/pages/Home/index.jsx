import React from "react";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Product from "pages/Product";

export default function Home() {
    const { isAuthenticated } = useSelector((state) => state.user);

    if (!isAuthenticated) return <Navigate to="/signin" state={{ from: "/" }} />;
    return <Product />;
}
