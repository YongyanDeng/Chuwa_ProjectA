import { useEffect, useState } from "react";
import { Card, Col, Row, Space, Image, Typography, Button, message, InputNumber, Tag } from "antd";
import {
    MinusOutlined,
    PlusOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { fetchOneProductAction } from "app/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateCartProduct, addCartProduct, getCart } from "app/userSlice";

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
        <>
            {oneProduct ? (
                <div className={styles.product_detail}>
                    <Typography.Title level={2} className={styles.title}>
                        Products Detail
                    </Typography.Title>
                    <Row className={styles.container} gutter={6} justify="center">
                        <Col span={12} className={styles.col_left}>
                            {/* <Card
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
                            ></Card> */}
                            <Image
                                className={styles.itemCardBadge}
                                width={"550px"}
                                height={"550px"}
                                src={oneProduct.imageUrl}
                                alt={oneProduct.name}
                            />
                        </Col>
                        <Col span={12} className={styles.col_right}>
                            <Typography.Text className={styles.product_category}>
                                {oneProduct.category}
                            </Typography.Text>
                            <Typography.Title level={2} className={styles.product_name}>
                                {oneProduct.name}
                            </Typography.Title>
                            <div className={styles.product_price_tag}>
                                <Typography.Title level={3} className={styles.product_price}>
                                    {`$${oneProduct.price}`}
                                </Typography.Title>
                                {oneProduct.stockNum === 0 ? (
                                    <Tag icon={<CloseCircleOutlined />} color="error">
                                        Out of Stock
                                    </Tag>
                                ) : (
                                    <Tag icon={<CheckCircleOutlined />} color="success">
                                        Adequate inventory
                                    </Tag>
                                )}
                            </div>
                            <Typography.Paragraph className={styles.product_description}>
                                {oneProduct.description}
                            </Typography.Paragraph>
                            <div className={styles.buttons}>
                                <AddToCartButton product={oneProduct} user={user} />
                                {user.category === "VENDOR" && (
                                    <Button
                                        className={styles.edit_btn}
                                        type="primary"
                                        onClick={editButtonClick(oneProduct)}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </div>

                            {/* <Card
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
                            </Card> */}
                        </Col>
                    </Row>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}

export default ProductDetail;
