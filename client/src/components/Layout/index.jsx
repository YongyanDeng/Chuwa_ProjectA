import React, { useMemo } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "components/Navbar";
import Footbar from "components/Footbar";
// import ErrorToast from "components/ErrorToast";
import { useMediaQuery } from "hooks/useMediaQuery";

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
    const isMobile = useMediaQuery("(max-width: 375px)");

    const headerStyle = useMemo(
        () => ({
            display: "flex",
            // justifyContent: "space-between",
            alignItems: !isMobile ? null : "flex-start",
            // width: "100%",
            width: !isMobile ? "100%" : "375px",
            height: !isMobile ? "48px" : "auto",
            backgroundColor: "#111827",
            padding: "8px 64px",
            flexDirection: !isMobile ? "row" : "column",
        }),
        [isMobile]
    );

    const footerStyle = useMemo(
        () => ({
            display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center",
            // width: "100%",
            width: !isMobile ? "100%" : "375px",
            height: !isMobile ? "85px" : "auto",
            color: "#FFFFFF",
            backgroundColor: "#111827",
            flexDirection: !isMobile ? "row" : "column",
        }),
        [isMobile]
    );

    const contentStyle = useMemo(
        () => ({
            display: "flex",
            height: !isMobile ? "calc(100vh - 48px - 85px)" : "auto",
            padding: "0 50px",
            width: !isMobile ? "100%" : "375px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F9FAFB",
        }),
        [isMobile]
    );

    return (
        <Layout>
            <Header style={headerStyle}>
                <Navbar />
            </Header>
            <Content style={contentStyle}>
                <Outlet />
            </Content>
            <Footer style={footerStyle}>
                <Footbar />
            </Footer>
        </Layout>
    );
}
