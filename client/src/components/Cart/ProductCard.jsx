import "./styles.css";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Image, Col, Row, InputNumber, Button, Typography } from "antd";

import { updateCartProduct, removeCartProduct } from "app/userSlice";

const { Title } = Typography;

export default function ProductCard({ user, product }) {
    const [amount, setAmount] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setAmount(product.quantity);
    }, []);

    const handleQuantityChange = (value) => {
        setAmount(value);
        dispatch(
            updateCartProduct({
                userId: user.id,
                productId: product.id,
                curQuantity: value,
            })
        );
    };

    const handleDecrement = () => {
        handleQuantityChange(amount - 1);
    };
    const handleIncrement = () => {
        handleQuantityChange(amount + 1);
    };

    const handleRemove = () => {
        dispatch(
            removeCartProduct({
                userId: user.id,
                productId: product.id,
            })
        );
    };

    return (
        <Row style={{ margin: "20px" }}>
            <Col span={8} style={{ marginRight: "20px" }}>
                <Image alt="product" src={product.imageUrl} />
            </Col>
            <Col span={16}>
                <div className="product-text">
                    <Title className="product-name">{product.name}</Title>
                    <Title className="product-price" level={3}>{`$${product.price}`}</Title>
                </div>
                <div className="product-controller">
                    <div className="product-quantity">
                        <Button
                            icon={<MinusOutlined />}
                            onClick={handleDecrement}
                            disabled={amount <= 1}
                        />
                        <InputNumber className="centered-input" value={amount} readOnly />
                        <Button
                            icon={<PlusOutlined />}
                            onClick={handleIncrement}
                            disabled={amount >= product.stockNum}
                        />
                    </div>
                    <Button className="product-remove" type="link" onClick={handleRemove}>
                        Remove
                    </Button>
                </div>
            </Col>
        </Row>
    );
}
