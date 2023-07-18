import {
    Badge,
    Button,
    Card,
    Image,
    List,
    message,
    Typography,
    Select,
    Pagination,
    InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductsAction, fetchOneProductAction } from "app/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateCartProduct, removeCartProduct } from "app/userSlice";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./style.module.css";

function Products() {
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.products);
    const { user, cart } = useSelector((state) => state.user);
    const [sortOrder, setSortOrder] = useState("lowHigh");
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    // const onSubmit = (data) => {
    //     dispatch(createProductAction({ userId: user.id, text: data.text })).then(() => {
    //         navigate("/");
    //     });
    // };

    useEffect(() => {
        dispatch(fetchProductsAction(user));
    }, []);
    const getSortedItems = () => {
        const sortedItems = [...products];
        sortedItems.sort((a, b) => {
            if (sortOrder === "lowHigh") {
                return a.price > b.price ? 1 : a.price === b.price ? 0 : -1;
            } else if (sortOrder === "highLow") {
                return a.price < b.price ? 1 : a.price === b.price ? 0 : -1;
            }
        });
        return sortedItems;
    };
    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };
    const renderItemsForCurrentPage = () => {
        const itemsPerPage = 8; // Number of items to display per page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const itemsForCurrentPage = getSortedItems().slice(startIndex, endIndex);
        const rows = [];
        let index = startIndex + 1; // Start indexing from the first item

        for (let i = 0; i < itemsForCurrentPage.length; i += 4) {
            const rowItems = itemsForCurrentPage.slice(i, i + 4).map((product, productIndex) => ({
                ...product,
                index: index++, // Assign the index to each item
            }));

            rows.push(rowItems);
        }
        const transposedRows = rows[0]?.map((_, columnIndex) =>
            rows.map((row) => row[columnIndex]),
        );

        return transposedRows;
    };
    const imageHandleClick = (product) => (e) => {
        console.log(product);
        navigate(`/products/${product._id}`);
    };

    const editButtonClick = (product) => (e) => {
        dispatch(fetchOneProductAction(product._id)).then(() => {
            navigate(`/user/${user.id}/edit-product/${product._id}`);
        });
    };
    const addProductButtonClick = (e) => {
        navigate(`/new-product`);
    };
    return (
        <div className={styles.productsContainer}>
            <div className={styles.topContent}>
                <Typography.Text>View Items Sorted By: </Typography.Text>
                <Select
                    onChange={(value) => {
                        setSortOrder(value);
                    }}
                    defaultValue={"Price Low to High"}
                    options={[
                        {
                            label: "Price Low to High",
                            value: "lowHigh",
                        },
                        {
                            label: "Price High to Low",
                            value: "highLow",
                        },
                    ]}
                ></Select>
                <Button type="primary" onClick={addProductButtonClick}>
                    Add Product
                </Button>
                ,
            </div>
            <List
                loading={status === "pending"}
                grid={{
                    gutter: 8,
                    xs: 4,
                    sm: 4,
                    md: 4,
                    lg: 4,
                    xl: 4,
                    xxl: 4,
                }}
                dataSource={renderItemsForCurrentPage()}
                renderItem={(row) => (
                    <List.Item style={{ height: "100%" }}>
                        {row.map((product, productIndex) => (
                            // <Badge.Ribbon
                            //     className="itemCardBadge"
                            //     text={`${product.discountPercentage}% Off`}
                            //     color="pink"
                            //     key={productIndex}
                            // >
                            <Card
                                key={productIndex}
                                className={styles.itemCard}
                                title={product.name}
                                cover={
                                    <Image
                                        className={styles.itemCardBadge}
                                        src={product.imageUrl}
                                        alt={product.name}
                                        onClick={imageHandleClick(product)}
                                    />
                                }
                                actions={[
                                    <AddToCartButton product={product} user={user} />,
                                    <Button type="primary" onClick={editButtonClick(product)}>
                                        Edit
                                    </Button>,
                                ]}
                                style={{ flex: 1, height: "100%" }}
                            >
                                <Card.Meta
                                    title={
                                        <Typography.Paragraph>
                                            Price: ${product.price}
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
                                            {product.description}
                                        </Typography.Paragraph>
                                    }
                                />
                            </Card>
                            // </Badge.Ribbon>
                        ))}
                    </List.Item>
                )}
            />

            <Pagination
                current={currentPage}
                total={products.length}
                pageSize={8} // Number of items to display per page
                onChange={handlePaginationChange}
            />
        </div>
    );
}

function AddToCartButton({ product, user }) {
    const [loading, setLoading] = useState(false);
    const [addCartCliked, setAddCartClicked] = useState(false);
    const [amount, setAmount] = useState(0);
    const [number, setNumber] = useState(0);
    const dispatch = useDispatch();

    const addProductToCart = () => {
        message.success(`${product.name} has been added to cart!`);
        setAddCartClicked(true);
        setAmount(amount + 1);
        setNumber(number + 1);
        handleQuantityChange(amount + 1);
    };

    // useEffect(() => {
    //     setAmount(cart[product._id]);
    // }, []);

    const handleQuantityChange = (value) => {
        setNumber(value);
        setAmount(value);
        dispatch(
            updateCartProduct({
                userId: user.id,
                productId: product._id,
                curQuantity: value,
            }),
        );
    };

    const handleDecrement = () => {
        handleQuantityChange(amount - 1);
    };
    const handleIncrement = () => {
        handleQuantityChange(amount + 1);
    };

    // useEffect(() => {
    //   if (count===0){setAddCartClicked(false)}
    // }, [count]);
    return addCartCliked & (amount > 0) ? (
        <Button.Group>
            <Button icon={<MinusOutlined />} onClick={handleDecrement} />
            <InputNumber className="centered-input" value={amount} readOnly />
            <Button
                icon={<PlusOutlined />}
                onClick={handleIncrement}
                disabled={amount >= product.stockNum}
            />
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
export default Products;
