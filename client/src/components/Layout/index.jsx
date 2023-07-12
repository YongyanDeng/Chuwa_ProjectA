import React, { useMemo } from "react";
import { Layout } from "antd";
// import { Outlet } from "react-router-dom";
// import Navbar from "components/Navbar";
// import ErrorToast from "components/ErrorToast";
import { useMediaQuery } from "hooks/useMediaQuery";

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
    const isMobile = useMediaQuery("(max-width: 375px)");

    const headerStyle = useMemo(
        () => ({
            display: "flex",
            width: "100%",
            height: "48px",
            color: "#FFFFFF",
            backgroundColor: "#111827",
            padding: "8 64px",
            justifyContent: "space-between",
            alignItems: "center",
        }),
        []
    );

    const footerStyle = useMemo(
        () => ({
            width: "100%",
            height: "85px",
            color: "#FFFFFF",
            backgroundColor: "#111827",
            flexShrink: "0",
        }),
        []
    );

    const contentStyle = useMemo(
        () => ({
            height: "calc(100vh - 48px - 85px)",
            padding: "0 50px",
            width: isMobile ? "100%" : "375px",
        }),
        [isMobile]
    );

    return (
        <Layout>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>Content</Content>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    );
}
