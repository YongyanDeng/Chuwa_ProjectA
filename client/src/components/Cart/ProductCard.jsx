import "./styles.css";

import React from "react";
import { Image, Col, Row, InputNumber, Button, Typography } from "antd";

const { Title, Text } = Typography;

export default function ProductCard({ product }) {
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
                    <InputNumber className="product-quantity" defaultValue={product.quantity} />
                    <Button className="product-remove" type="link">
                        Remove
                    </Button>
                </div>
            </Col>
        </Row>
    );
}
