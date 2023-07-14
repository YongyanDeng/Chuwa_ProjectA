import { Typography } from "antd";

export default function Cart({ cart }) {
    // const products = [
    //     { name: "product1", price: 10, quantity: 20 },
    //     { name: "product2", price: 20, quantity: 20 },
    //     { name: "product3", price: 30, quantity: 20 },
    // ];

    return (
        <div>
            {cart.length ? (
                <ul>
                    {cart.map((product) => (
                        <li key={product.id}>
                            <p>{`${product.name} ------------- ${product.quantity}`}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <Typography style={{ color: "#6B7280" }}>Your cart is empty</Typography>
            )}
        </div>
    );
}
