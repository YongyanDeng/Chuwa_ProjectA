import { useEffect, useState } from "react";
import { Card, Col, Row, Space, Image, Typography, Button, message } from "antd";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOneProductAction } from "app/productSlice";
import styles from "./style.module.css";

function ProductDetail() {
    const dispatch = useDispatch();
    const { oneProduct, status } = useSelector((state) => state.products);
    const { productId } = useParams();
    useEffect(() => {
        dispatch(fetchOneProductAction(productId));
    }, [productId]);
    return (
        <div className={styles.container}>
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
                                    <div className={styles.cardActions}>
                                        <AddToCartButton item={productId} />
                                        <EditProductButton item={productId} />
                                    </div>,
                                ]}
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
function EditProductButton({ item }) {
    const [loading, setLoading] = useState(false);
    return (
        <Button type="primary" onClick={() => {}} loading={loading}>
            Edit
        </Button>
    );
}

function AddToCartButton({ item }) {
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [addCartCliked, setAddCartClicked] = useState(false);

    const addProductToCart = () => {
        message.success(`${item.name} has been added to cart!`);
        setAddCartClicked(true);
        setCount(count + 1);
    };

    const incremenetClick = () => {
        setCount(count + 1);
    };
    const decrementClick = () => {
        setCount(count - 1);
    };
    // useEffect(() => {
    //   if (count===0){setAddCartClicked(false)}
    // }, [count]);
    return addCartCliked & (count > 0) ? (
        <Button.Group>
            <Button
                type="primary"
                onClick={() => {
                    incremenetClick();
                }}
            >
                +
            </Button>
            <div> {count} </div>
            <Button
                type="primary"
                onClick={() => {
                    decrementClick();
                }}
            >
                -
            </Button>
        </Button.Group>
    ) : (
        <Button
            type="primary"
            onClick={() => {
                addProductToCart();
            }}
            loading={loading}
        >
            Add to Cart
        </Button>
    );
}
export default ProductDetail;
