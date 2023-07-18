import React, { useState, useEffect } from "react";
import ProductForm from "components/ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProductAction, updateProductAction } from "app/productSlice";
import { removeError } from "app/errorSlice";
import { useParams } from "react-router-dom";
import { Button, message } from "antd";
import styles from "./style.module.css";
export default function EditProduct() {
    const { id, productId } = useParams();
    const { oneProduct, status } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const deleteButtonClick = (e) => {
        if ((user.category === "VENDOR") & (oneProduct.createdBy === id)) {
            dispatch(deleteProductAction({ id: id, productId: productId })).then(() => {
                message.success("the product is deleted successfully");
                navigate(`/`);
            });
        } else {
            message.error(`Unauthorized`);
        }
    };
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
            {status === "pending" ? (
                <div>Loading...</div>
            ) : status === "succeeded" ? (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <ProductForm
                        updateProduct={true}
                        product={oneProduct}
                        buttonText="Update product"
                        onSubmit={onSubmit}
                        title="Update product"
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            deleteButtonClick();
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ) : (
                <div>Failed to fetch product data.</div>
            )}
        </>
    );
}
