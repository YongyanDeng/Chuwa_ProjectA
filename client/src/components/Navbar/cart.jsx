import "./styles.css";

export default function Cart({ cart }) {
    // const products = [
    //     { name: "product1", price: 10, quantity: 20 },
    //     { name: "product2", price: 20, quantity: 20 },
    //     { name: "product3", price: 30, quantity: 20 },
    // ];

    return (
        <div>
            <ul>
                {cart.map((product) => (
                    <li key={product.id}>
                        <p>{`${product.name} ------------- ${product.quantity}`}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
