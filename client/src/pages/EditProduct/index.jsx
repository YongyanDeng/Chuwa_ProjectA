import React, { useState, useEffect } from "react";
import ProductForm from "components/ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteProductAction, updateProductAction, fetchOneProductAction } from "app/productSlice";
import { removeError } from "app/errorSlice";
import { useParams } from "react-router-dom";
import { Button, message } from "antd";
import styles from "./style.module.css";

export default function EditProduct() {
    const { id, productId } = useParams();
    const { oneProduct, status } = useSelector((state) => state.products);
    const { message: error } = useSelector((state) => state.error);
    const { user } = useSelector((state) => state.user);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

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
    useEffect(() => {
        dispatch(fetchOneProductAction(productId));
    }, []);
    const onSubmit = (data) => {
        setSubmitted(true);
        const {
            productName: name,
            productDescription: description,
            price: price,
            category: category,
            inStockQuantity: stockNum,
            addImageLink: imageUrl,
        } = data;
        const product = { ...oneProduct };
        product.name = name;
        product.description = description;
        product.price = price;
        product.category = category;
        product.stockNum = stockNum;
        product.imageUrl = imageUrl;
        dispatch(updateProductAction({ id, productId, product: product }));
    };

    useEffect(() => {
        dispatch(removeError());
    }, []);

    useEffect(() => {
        if (status !== "failed" && submitted) {
            navigate("/user/${id}/edit-product/${productId}");
        } else if (status === "failed" && submitted) {
            message.error(`${error}`);
        }
    }, [submitted, status]);

    // redirect to product list page
    // useEffect(() => {
    //     console.log("submitted:", submitted);
    //     if (submitted && !error) navigate("/");
    // }, [error]);

    return (
        <>
            {status === "pending" ? (
                <div>Loading...</div>
            ) : status !== "failed" ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                    }}
                >
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
                        style={{ display: "flex", width: "30%", justifyContent: "center" }}
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
