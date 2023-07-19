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
import { updateCartProduct, addCartProduct, getCart } from "app/userSlice";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

export default function AddToCartButton({ product, user }) {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const { cart } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const addProductToCart = () => {
        dispatch(addCartProduct({ id: user.id, product: { productId: product._id, quantity: 1 } }))
            .then(() => {
                message.success(`${product.name} has been added to cart!`);
                dispatch(getCart(user));
                setAmount(amount + 1);
            })
            .catch((error) => {
                // Handle any potential errors
                console.log("Error adding product to cart:", error);
            });
    };

    useEffect(() => {
        const productIndex = cart.findIndex((productInCart) => productInCart.id === product._id);
        if (productIndex !== -1) {
            setAmount(cart[productIndex].quantity);
        } else {
            setAmount(0);
        }
    }, []);
    useEffect(() => {
        const productIndex = cart.findIndex((productInCart) => productInCart.id === product._id);
        if (productIndex !== -1) {
            setAmount(cart[productIndex].quantity);
        } else {
            setAmount(0);
        }
    }, [cart]);

    const handleQuantityChange = (value) => {
        setAmount(value);
        dispatch(
            updateCartProduct({
                userId: user.id,
                productId: product._id,
                curQuantity: value,
            }),
        ).then(() => {
            dispatch(getCart(user));
        });
    };

    const handleDecrement = () => {
        handleQuantityChange(amount - 1);
    };
    const handleIncrement = () => {
        handleQuantityChange(amount + 1);
    };

    return amount > 0 ? (
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
            style={{
                width: "110px",
                height: "26px",
            }}
            type="primary"
            onClick={() => {
                addProductToCart();
            }}
            loading={loading}
        >
            Add
        </Button>
    );
}
