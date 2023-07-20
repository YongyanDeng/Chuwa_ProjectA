import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Col, Row, Image, Typography, Button, message, Tag } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useMediaQuery } from "hooks/useMediaQuery";

import { fetchOneProductAction } from "app/productSlice";

import AddToCartButton from "components/Product/AddToCart";
import styles from "./style.module.css";

function ProductDetail() {
    const isMobile = useMediaQuery("(max-width: 392px)");

    const dispatch = useDispatch();
    const location = useLocation();
    const { oneProduct, products } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const { productId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchOneProductAction(productId));
    }, [products]);

    // navigate to Edit-Product page
    const editButtonClick = (product) => (e) => {
        if ((user.category === "VENDOR") & (product.createdBy === user.id)) {
            dispatch(fetchOneProductAction(product._id)).then(() => {
                // navigate(`/user/${user.id}/edit-product/${product._id}`);
                navigate(`/user/${user.id}/edit-product/${product._id}`, {
                    state: { from: location.pathname },
                });
            });
        } else {
            message.error(`Unauthorized`);
        }
    };

    const handleCloseIconClick = () => {
        navigate("/");
    };

    if (!oneProduct)
        return (
            <>
                <p>Loading...</p>
            </>
        );

    return (
        <>
            {!isMobile ? (
                <div className={styles.product_detail}>
                    <div className={styles.title_box}>
                        <Typography.Title level={2} className={styles.title}>
                            Products Detail
                        </Typography.Title>
                        <CloseCircleOutlined
                            style={{ fontSize: "30px" }}
                            onClick={handleCloseIconClick}
                        />
                    </div>

                    <Row className={styles.container} gutter={6} justify="center">
                        <Col span={12} className={styles.col_left}>
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
                        </Col>
                    </Row>
                </div>
            ) : (
                <div className={styles.product_detail}>
                    <div className={styles.title_box}>
                        <Typography.Title level={2} className={styles.title}>
                            Products Detail
                        </Typography.Title>
                        <CloseCircleOutlined
                            style={{ fontSize: "30px" }}
                            onClick={handleCloseIconClick}
                        />
                    </div>

                    <div className={styles.mobile_container}>
                        <Image
                            className={styles.itemCardBadge}
                            width={"308px"}
                            height={"276px"}
                            src={oneProduct.imageUrl}
                            alt={oneProduct.name}
                        />
                        <div className={styles.mobile_texts}>
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
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetail;
