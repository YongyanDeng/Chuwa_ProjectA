import "./styles.css";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Typography, Button, Popover } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import Cart from "components/Cart";
import CartTitle from "components/Cart/CartTitle";
import { logOut, getCart } from "app/userSlice";

const { Search } = Input;
const { Title, Paragraph, Text } = Typography;
const title = "Management";
const companyName = "Chuwa";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { pathname: location } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user, cart, totalPrice } = useSelector((state) => state.user);

    useEffect(() => {
        if (isAuthenticated) dispatch(getCart(user));
    }, [isAuthenticated]);

    useEffect(() => {
        setOpen(false);
    }, [location]);

    // Btn click handlers
    const handleSearch = (value) => console.log(value);
    const handleSignBtnClick = (e) => {
        if (e.target.innerText === "Sign Out") dispatch(logOut());
        navigate("/signin");
    };
    const handleCartIconClick = () => {
        setOpen(true);
        dispatch(getCart(user));
    };
    const closePopover = () => {
        setOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="title">
                <Title level={3} style={{ margin: 0, color: "#FFF" }}>
                    {title}
                </Title>
                <Text style={{ margin: 0, color: "#FFF" }}>{companyName}</Text>
            </div>
            <Search className="searchBox" allowClear placeholder="Search" onSearch={handleSearch} />
            <div className="right-menu">
                <div className="menu">
                    <Button>
                        <UserOutlined style={{ color: "#fff", fontSize: "20px" }} />
                    </Button>
                    <Button
                        type="link"
                        onClick={handleSignBtnClick}
                        style={{ color: "#FFF", fontFamily: "Inter", fontSize: "15px" }}
                    >
                        {isAuthenticated ? `Sign Out` : `Sign In`}
                    </Button>
                </div>
                <div className="menu">
                    <Popover
                        title={<CartTitle len={cart.length} handleCartClose={closePopover} />}
                        placement="bottom"
                        content={<Cart />}
                        trigger="click"
                        open={open}
                        arrow={false}
                    >
                        <Button onClick={handleCartIconClick}>
                            <ShoppingCartOutlined style={{ color: "#fff", fontSize: "23px" }} />
                        </Button>
                    </Popover>

                    <Paragraph
                        style={{
                            color: "#FFF",
                            fontFamily: "Inter",
                            fontSize: "15px",
                            margin: "0px",
                        }}
                    >
                        {`$ ${totalPrice.toFixed(2)}`}
                    </Paragraph>
                </div>
            </div>
        </nav>
    );
}
