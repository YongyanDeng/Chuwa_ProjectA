import "./styles.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Space, Input, Typography, Drawer } from "antd";
// import { useSelector } from "react-redux";
import Cart from "./cart";

const { Search } = Input;
const { Title, Paragraph } = Typography;
const title = "Management";
const companyName = "Chuwa";

export default function Navbar() {
    // const { isAuthenticated } = useSelector((state) => state.user);
    const [open, setOpen] = useState(false);
    const { pathname: location } = useLocation();

    const onClose = () => {
        setOpen(!open);
    };

    useEffect(() => {
        setOpen(false);
    }, [location]);

    const handleSearch = (value) => console.log(value);
    const handleIconClick = () => {
        console.log("Icons clicked");
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
            <div className="right">
                <div className="user">
                    <button
                        onClick={handleIconClick}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                        <UserOutlined style={{ color: "#fff", fontSize: "20px" }} />
                    </button>
                    <Link style={{ color: "#FFF", fontSize: "15px" }}>Sign In</Link>
                </div>
                <div className="cart">
                    <button
                        onClick={onClose}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                        <ShoppingCartOutlined style={{ color: "#fff", fontSize: "20px" }} />
                    </button>
                    <p style={{ color: "#FFF", fontFamily: "Inter", fontSize: "15px" }}>$0.00</p>
                </div>
            </div>
            <Drawer
                title={`Cart - ()`}
                placement="right"
                closable={true}
                open={open}
                onClose={onClose}
                style={{ zIndex: 99 }}
                closeIcon={<CloseCircleOutlined />}
            >
                <Cart />
            </Drawer>
        </nav>
    );
}
