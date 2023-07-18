import React, { useState, useEffect } from "react";
import ProductForm from "components/ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProductAction } from "app/productSlice";
import { message } from "antd";
import { removeError } from "app/errorSlice";
import styles from "./style.module.css";
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
            price: price,
            category: category,
            inStockQuantity: stockNum,
            ImageLink: imageUrl,
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

    // redirect to product list page
    // useEffect(() => {
    //     console.log("submitted:", submitted);
    //     if (submitted && !error) navigate("/");
    // }, [error]);
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
