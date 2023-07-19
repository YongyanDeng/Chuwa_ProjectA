import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { createProductAction } from "app/productSlice";
import ProductForm from "components/ProductForm";

export default function NewProduct() {
    const { user } = useSelector((state) => state.user);
    const { status } = useSelector((state) => state.products);
    const { message: error } = useSelector((state) => state.error);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === "successed" && submitted) {
            navigate("/");
        } else if (status === "failed" && submitted) {
            message.error(`${error}`);
        }
    }, [submitted, status]);

    const onSubmit = (data) => {
        setSubmitted(true);
        const {
            productName: name,
            productDescription: description,
            price,
            category,
            inStockQuantity: stockNum,
            addImageLink: imageUrl,
        } = data;
        const product = {
            name,
            description,
            price,
            category,
            stockNum,
            createdBy: user.id,
            imageUrl,
        };

        dispatch(createProductAction({ id: user.id, product: product }));
    };

    return (
        <ProductForm
            updateProduct={false}
            product={{}}
            buttonText="Add product"
            onSubmit={onSubmit}
            title="Create new product"
        />
    );
}
