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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { updateCartProduct, addCartProduct, getCart } from "app/userSlice";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import AddToCartButton from "components/Product/AddToCart";
import { useMediaQuery } from "hooks/useMediaQuery";
import styles from "./style.module.css";

function Products() {
    const isMobile = useMediaQuery("(max-width: 392px)");
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const [sortOrder, setSortOrder] = useState("lowHigh");
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);

    let itemsPerPage = 8;
    let rowItemNumber = 4;
    if (isMobile) {
        itemsPerPage = 3;
        rowItemNumber = 1;
    }
    const renderItemsForCurrentPage = ({ itemsPerPage, rowItemNumber }) => {
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
            for (let i = 0; i < itemsForCurrentPage.length; i += rowItemNumber) {
                const rowItems = itemsForCurrentPage
                    .slice(i, i + rowItemNumber)
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
                                <Col key={productIndex} xs={24} sm={12} md={8} lg={6}>
                                    <Card
                                        className={styles.itemCard}
                                        cover={
                                            <Image
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "auto",
                                                    padding: "6px",
                                                }} // Adjusted inline styles
                                                src={product.imageUrl}
                                                alt={product.name}
                                                onClick={imageHandleClick(product)} // Corrected onClick syntax
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
                                                <Typography.Text>{product.name}</Typography.Text>
                                            }
                                            description={
                                                <>
                                                    <Typography.Text>
                                                        ${product.price.toFixed(2)}
                                                    </Typography.Text>
                                                </>
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

    useEffect(() => {
        dispatch(fetchProductsAction(user));
        dispatch(getCart(user));
    }, []);

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
        dispatch(getCart(user));
    };

    const imageHandleClick = (product) => (e) => {
        console.log(product);
        navigate(`/products/${product._id}`);
    };

    const editButtonClick = (product) => (e) => {
        if ((user.category === "VENDOR") & (product.createdBy === user.id)) {
            dispatch(fetchOneProductAction(product._id)).then(() => {
                navigate(`/user/${user.id}/edit-product/${product._id}`, {
                    state: { from: location.pathname },
                });
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
                <div>
                    <Typography.Title>Products</Typography.Title>
                </div>
                <Row gutter={[16, 16]}>
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
                        ></Select>
                    </div>
                    <></>
                    <div>
                        {user.category === "VENDOR" && (
                            <Button type="primary" onClick={addProductButtonClick}>
                                Add Product
                            </Button>
                        )}
                    </div>
                </Row>
            </div>
            {renderItemsForCurrentPage({ itemsPerPage, rowItemNumber })}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Pagination
                    current={currentPage}
                    total={products.length}
                    pageSize={itemsPerPage} // Number of items to display per page
                    onChange={handlePaginationChange}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} products`}
                    defaultCurrent={1}
                />
            </div>
        </div>
    );
}

export default Products;
