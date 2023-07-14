import "./styles.css";

import { Typography, Button, Form, Col, Row, Input } from "antd";
import ProductCard from "./ProductCard";

export default function Cart({ cart }) {
    if (!cart.length) {
        return (
            <div>
                <Typography.Paragraph className="EmptyDrawerHint">
                    Your cart is empty. Go shopping!
                </Typography.Paragraph>
            </div>
        );
    }

    return (
        <>
            <div className="products">
                {cart.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <div className="coupon">
                <Form layout="vertical">
                    <Row gutter={8} style={{ alignItems: "center" }}>
                        <Col span={20}>
                            <Form.Item name="discount" label="Apply Discount Code">
                                <Input placeholder="Please enter discount code" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Button className="btn" htmlType="submit" size="large">
                                Apply
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className="checkout">
                <Button className="btn">Check Out</Button>
            </div>
        </>
    );
}
