import {
    Badge,
    Button,
    Card,
    Image,
    List,
    message,
    Rate,
    Spin,
    Typography,
    Select,
} from 'antd';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsAction } from 'app/productSlice';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './style.module.css';

function Products() {
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.user);
    const [sortOrder, setSortOrder] = useState('az');
    const navigate = useNavigate();

    // const onSubmit = data =>{
    //     dispatch(createProductAction({userId: user.id, text:data.text})
    //     ).then(()=>{
    //         navigate('/');
    //     });
    // };

    useEffect(() => {
        dispatch(fetchProductsAction());
    }, []);
    const getSortedItems = () => {
        const sortedItems = [...products];
        sortedItems.sort((a, b) => {
            const aLowerCaseTitle = a.name.toLowerCase();
            const bLowerCaseTitle = b.name.toLowerCase();

            if (sortOrder === 'az') {
                return aLowerCaseTitle > bLowerCaseTitle
                    ? 1
                    : aLowerCaseTitle === bLowerCaseTitle
                    ? 0
                    : -1;
            } else if (sortOrder === 'za') {
                return aLowerCaseTitle < bLowerCaseTitle
                    ? 1
                    : aLowerCaseTitle === bLowerCaseTitle
                    ? 0
                    : -1;
            } else if (sortOrder === 'lowHigh') {
                return a.price > b.price ? 1 : a.price === b.price ? 0 : -1;
            } else if (sortOrder === 'highLow') {
                return a.price < b.price ? 1 : a.price === b.price ? 0 : -1;
            }
        });
        return sortedItems;
    };
    const imageHandleClick = (product) => (e) => {
        console.log(product);
        navigate(`/products/${product._id}`);
    };
    return (
        <div className={styles.productsContainer}>
            <div>
                <Typography.Text>View Items Sorted By: </Typography.Text>
                <Select
                    onChange={(value) => {
                        setSortOrder(value);
                    }}
                    defaultValue={'az'}
                    options={[
                        {
                            label: 'Alphabetically a-z',
                            value: 'az',
                        },
                        {
                            label: 'Alphabetically z-a',
                            value: 'za',
                        },
                        {
                            label: 'Price Low to High',
                            value: 'lowHigh',
                        },
                        {
                            label: 'Price High to Low',
                            value: 'highLow',
                        },
                    ]}
                ></Select>
            </div>
            <List
                loading={status === 'pending'}
                grid={{ column: 4 }}
                dataSource={getSortedItems()}
                renderItem={(product, index) => {
                    return (
                        <Badge.Ribbon
                            className={styles.itemCardBadge}
                            color='pink'
                        >
                            <Card
                                className={styles.itemCard}
                                title={product.name}
                                key={index}
                                cover={
                                    <Image
                                        className={styles.itemCardBadge}
                                        src={product.imageUrl}
                                        alt={product.name}
                                        onClick={imageHandleClick(product)}
                                    />
                                }
                                actions={[
                                    <AddToCartButton item={product} />,
                                    <EditProductButton item={product} />,
                                ]}
                            >
                                <Card.Meta
                                    title={
                                        <Typography.Paragraph>
                                            Price: ${product.price}{' '}
                                        </Typography.Paragraph>
                                    }
                                    description={
                                        <Typography.Paragraph
                                            ellipsis={{
                                                rows: 2,
                                                expandable: true,
                                                symbol: 'more',
                                            }}
                                        >
                                            {product.description}
                                        </Typography.Paragraph>
                                    }
                                ></Card.Meta>
                            </Card>
                        </Badge.Ribbon>
                    );
                }}
            ></List>
        </div>
    );
}

function EditProductButton({ item }) {
    const [loading, setLoading] = useState(false);
    return (
        <Button type='primary' onClick={() => {}} loading={loading}>
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
                type='primary'
                onClick={() => {
                    incremenetClick();
                }}
            >
                +
            </Button>
            <div> {count} </div>
            <Button
                type='primary'
                onClick={() => {
                    decrementClick();
                }}
            >
                -
            </Button>
        </Button.Group>
    ) : (
        <Button
            type='primary'
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
