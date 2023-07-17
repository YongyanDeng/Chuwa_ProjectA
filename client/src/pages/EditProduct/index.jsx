import React, { useState, useEffect } from "react";
import ProductForm from "components/ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOneProductAction, updateProductAction } from "app/productSlice";
import { removeError } from "app/errorSlice";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";
export default function EditProduct() {
    const { id, productId } = useParams();
    const { oneProduct, status } = useSelector((state) => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(fetchOneProductAction(productId));
    // }, []);
    const onSubmit = (data) => {
        // setSubmitted(true);
        const {
            productName: name,
            productDescription: description,
            price: price,
            category: category,
            inStockQuantity: stockNum,
            ImageLink: imageUrl,
        } = data;
        const product = { ...oneProduct };
        product.name = name;
        product.description = description;
        product.price = price;
        product.category = category;
        product.stockNum = stockNum;
        product.imageUrl = imageUrl;
        dispatch(updateProductAction({ id, productId, product: product })).then(() => {
            navigate("/");
        });
    };
    useEffect(() => {
        dispatch(removeError());
    }, []);
    // redirect to product list page
    // useEffect(() => {
    //     console.log("submitted:", submitted);
    //     if (submitted && !error) navigate("/");
    // }, [error]);
    return (
        <>
            {status === "loading" ? (
                <div>Loading...</div>
            ) : status === "succeeded" ? (
                <ProductForm
                    updateProduct={true}
                    product={oneProduct}
                    buttonText="Update product"
                    onSubmit={onSubmit}
                    title="Update product"
                />
            ) : (
                <div>Failed to fetch product data.</div>
            )}
        </>
    );
}
