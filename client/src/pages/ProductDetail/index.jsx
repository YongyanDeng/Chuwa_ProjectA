import { useEffect, useState } from "react";
import { Card, Col, Row, Space, Image, Typography, Button, message, InputNumber } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { fetchOneProductAction } from "app/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateCartProduct, addCartProduct, getCart } from "app/userSlice";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import AddToCartButton from "components/Product/AddToCart";
import styles from "./style.module.css";

function ProductDetail() {
    const dispatch = useDispatch();
    const { oneProduct, status } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const { productId } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(fetchOneProductAction(productId));
    }, [productId]);
    const editButtonClick = (product) => (e) => {
        if ((user.category === "VENDOR") & (product.createdBy === user.id)) {
            dispatch(fetchOneProductAction(product._id)).then(() => {
                navigate(`/user/${user.id}/edit-product/${product._id}`);
            });
        } else {
            message.error(`Unauthorized`);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.topContent}>
                <Typography.Title>Products Detail </Typography.Title>
            </div>
            {oneProduct ? (
                <div>
                    <Row gutter={6} justify="center">
                        <Col span={12}>
                            <Card
                                title={oneProduct.name}
                                bordered={false}
                                bodyStyle={{ padding: 0 }}
                                key={productId}
                                cover={
                                    <Image
                                        className={styles.itemCardBadge}
                                        src={oneProduct.imageUrl}
                                        alt={oneProduct.name}
                                    />
                                }
                                className={styles.card}
                            ></Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                title={oneProduct.name}
                                key={productId}
                                actions={[
                                    <div
                                        style={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <AddToCartButton product={oneProduct} user={user} />
                                        {user.category === "VENDOR" && (
                                            <Button
                                                type="primary"
                                                onClick={editButtonClick(oneProduct)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        ,
                                    </div>,
                                ]}
                                style={{ flex: 1, height: "100%" }}
                                className={styles.card}
                            >
                                <Card.Meta
                                    title={
                                        <Typography.Paragraph>
                                            Price: ${productId.price}{" "}
                                        </Typography.Paragraph>
                                    }
                                    description={
                                        <Typography.Paragraph
                                            ellipsis={{
                                                rows: 2,
                                                expandable: true,
                                                symbol: "more",
                                            }}
                                        >
                                            Description:{productId.description}
                                        </Typography.Paragraph>
                                    }
                                ></Card.Meta>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ProductDetail;
