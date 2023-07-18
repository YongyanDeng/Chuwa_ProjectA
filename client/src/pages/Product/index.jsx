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
    Row,
    Col,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductsAction, fetchOneProductAction, deleteProductAction } from "app/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateCartProduct, addCartProduct, getCart } from "app/userSlice";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import AddToCartButton from "components/Product/AddToCart";
import styles from "./style.module.css";

function Products() {
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const [sortOrder, setSortOrder] = useState("lowHigh");
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchProductsAction(user));
        dispatch(getCart(user));
    }, []);
    const getSortedItems = () => {
        const sortedItems = [...products];
        sortedItems.sort((a, b) => {
            if (sortOrder === "lowHigh") {
                return a.price > b.price ? 1 : a.price === b.price ? 0 : -1;
            } else if (sortOrder === "highLow") {
                return a.price < b.price ? 1 : a.price === b.price ? 0 : -1;
            } else if (sortOrder === "lastAdded") {
                return b.createdAt - a.createdAt;
            }
        });
        return sortedItems;
    };
    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };
    const renderItemsForCurrentPage = () => {
        const itemsPerPage = 8;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const sortedItems = getSortedItems();
        // Check if startIndex is within the range of the sortedItems array
        if (startIndex < sortedItems.length) {
            // Slice the sortedItems array to get the items for the current page
            let itemsForCurrentPage = 8;
            if (endIndex < sortedItems.length) {
                itemsForCurrentPage = sortedItems.slice(startIndex, endIndex);
            } else {
                itemsForCurrentPage = sortedItems.slice(startIndex, sortedItems.length - 1);
            }

            const rows = [];
            let index = startIndex + 1;
            for (let i = 0; i < itemsForCurrentPage.length; i += 4) {
                const rowItems = itemsForCurrentPage
                    .slice(i, i + 4)
                    .map((product, productIndex) => ({
                        ...product,
                        index: index++,
                    }));

                rows.push(rowItems);
            }

            return (
                <div>
                    {" "}
                    {rows.map((row, rowIndex) => (
                        <Row gutter={8} key={rowIndex}>
                            {row.map((product, productIndex) => (
                                <Col key={productIndex} span={6}>
                                    <Card
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
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <AddToCartButton product={product} user={user} />
                                                {user.category === "VENDOR" && (
                                                    <Button
                                                        type="primary"
                                                        onClick={editButtonClick(product)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                            </div>,
                                        ]}
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
                                </Col>
                            ))}
                        </Row>
                    ))}
                </div>
            );
        }
        return null;
    };
    const imageHandleClick = (product) => (e) => {
        console.log(product);
        navigate(`/products/${product._id}`);
    };

    const editButtonClick = (product) => (e) => {
        if ((user.category === "VENDOR") & (product.createdBy === user.id)) {
            dispatch(fetchOneProductAction(product._id)).then(() => {
                navigate(`/user/${user.id}/edit-product/${product._id}`);
            });
        } else {
            message.error(`Unauthorized`);
        }
    };
    const addProductButtonClick = (e) => {
        if (user.category === "VENDOR") {
            navigate(`/new-product`);
        } else {
            message.error(`Unauthorized`);
        }
    };

    return (
        <div className={styles.productsContainer}>
            <div className={styles.topContent}>
                <Typography.Title>Products </Typography.Title>
                <div>
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
                            {
                                label: "Last added",
                                value: "lastAdded",
                            },
                        ]}
                        style={{ margin: "10px" }}
                    ></Select>
                    {user.category === "VENDOR" ? (
                        <Button type="primary" onClick={addProductButtonClick}>
                            Add Product
                        </Button>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            {renderItemsForCurrentPage()}

            <Pagination
                current={currentPage}
                total={products.length}
                pageSize={8} // Number of items to display per page
                onChange={handlePaginationChange}
                style={{ paddingBottom: "20px" }}
            />
        </div>
    );
}

export default Products;
