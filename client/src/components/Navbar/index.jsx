import "./styles.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Space, Input, Typography, Drawer, Button } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import Cart from "./cart";
import { logOut, getCart } from "app/userSlice";

const { Search } = Input;
const { Title, Paragraph } = Typography;
const title = "Management";
const companyName = "Chuwa";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { pathname: location } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user, cart, totalPrice } = useSelector((state) => state.user);

    const onClose = () => {
        setOpen(!open);
    };

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
    };

    return (
        <nav className="navbar">
            <Space align="end">
                <Title level={3} style={{ margin: 0, color: "#FFF" }}>
                    {title}
                </Title>
                <Paragraph
                    style={{
                        margin: 0,
                        color: "#FFF",
                    }}
                >
                    {companyName}
                </Paragraph>
            </Space>
            <Search className="searchBox" allowClear placeholder="Search" onSearch={handleSearch} />
            <div className="right-menu">
                <div className="menu">
                    <button>
                        <UserOutlined style={{ color: "#fff", fontSize: "20px" }} />
                    </button>
                    <Button
                        type="link"
                        onClick={handleSignBtnClick}
                        style={{ color: "#FFF", fontSize: "15px" }}
                    >
                        {isAuthenticated ? `Sign Out` : `Sign In`}
                    </Button>
                </div>
                <div className="menu">
                    <button onClick={handleCartIconClick}>
                        <ShoppingCartOutlined style={{ color: "#fff", fontSize: "20px" }} />
                    </button>
                    <Paragraph style={{ color: "#FFF", fontFamily: "Inter", fontSize: "15px" }}>
                        {`$ ${totalPrice.toFixed(2)}`}
                    </Paragraph>
                </div>
            </div>
            <Drawer
                title={`Cart(${cart.length})`}
                placement="right"
                closable={true}
                open={open}
                onClose={onClose}
                style={{ zIndex: 99 }}
                closeIcon={<CloseCircleOutlined />}
            >
                <Cart cart={cart} />
            </Drawer>
        </nav>
    );
}
