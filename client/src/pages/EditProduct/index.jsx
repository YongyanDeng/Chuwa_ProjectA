import styles from "./style.module.css";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button, message } from "antd";

import { deleteProductAction, updateProductAction, fetchOneProductAction } from "app/productSlice";
import { removeError } from "app/errorSlice";
import ProductForm from "components/ProductForm";

export default function EditProduct() {
    const { id, productId } = useParams();
    const { oneProduct, status } = useSelector((state) => state.products);
    const { message: error } = useSelector((state) => state.error);
    const { user } = useSelector((state) => state.user);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(removeError());
    }, []);

    useEffect(() => {
        dispatch(fetchOneProductAction(productId));
    }, []);

    useEffect(() => {
        if (status === "successed" && submitted) {
            console.log(location.state.from);
            navigate(location.state.from);
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

    return (
        <>
            {status === "pending" ? (
                <div>Loading...</div>
            ) : status === "successed" ? (
                <div className={styles.container}>
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
