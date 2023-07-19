import {
    Form,
    Button,
    Input,
    InputNumber,
    Select,
    Upload,
    Space,
    Image,
    Row,
    Col,
    Card,
    Typography,
    select,
} from "antd";
import React, { useEffect, useState } from "react";
import style from "./styles.module.css";
import { useSelector } from "react-redux";
import { useMediaQuery } from "hooks/useMediaQuery";

const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
export default function ProductForm({ updateProduct, product, buttonText, onSubmit, title }) {
    const isMobile = useMediaQuery("(max-width: 392px)");
    const [imageUrl, setImageUrl] = useState("");
    const { status } = useSelector((state) => state.products);

    const initialValues = {
        productName: product?.name,
        productDescription: product?.description,
        category: product?.category,
        price: product?.price,
        inStockQuantity: product?.stockNum,
    };

    const handleImageLinkChange = (e) => {
        setImageUrl(e.target.value);
    };

    return (
        <div className={style.FormBox}>
            <div className={style.topContent}>
                <Typography.Title level={2} className={style.title}>
                    {title}
                </Typography.Title>
            </div>
            <div
                style={{
                    backgroundColor: "#FFF",
                    width: "100%",
                    padding: "5px",
                }}
            >
                {initialValues ? (
                    <Form
                        initialValues={initialValues}
                        onFinish={onSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="productName"
                            label="Product name"
                            rules={[{ required: true, message: "Please enter new product name" }]}
                            style={{
                                width: isMobile ? "300px" : "100%",
                                textAlign: "center",
                            }}
                        >
                            <Input className={style.inputbox} />
                        </Form.Item>
                        <Form.Item name="productDescription" label="Product Description">
                            <TextArea rows={4} />
                        </Form.Item>
                        {isMobile ? (
                            <>
                                <Form.Item
                                    name="category"
                                    label="Category"
                                    // style={{ width: "100%" }}
                                    labelCol={{ span: 32 }}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select a category",
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Select.Option value="category1">category1</Select.Option>
                                        <Select.Option value="category2">category2</Select.Option>
                                        <Select.Option value="category3">category3</Select.Option>
                                        <Select.Option value="category4">category4</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="price"
                                    label="Price"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter a price",
                                        },
                                    ]}
                                >
                                    <InputNumber className={style.inputbox} />
                                </Form.Item>
                            </>
                        ) : (
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "space-between",
                                    }}
                                >
                                    <Form.Item
                                        name="category"
                                        label="Category"
                                        // style={{ width: "100%" }}
                                        labelCol={{ span: 32 }}
                                        style={{ width: "300px" }}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select a category",
                                            },
                                        ]}
                                    >
                                        <Select>
                                            <Select.Option value="category1">
                                                category1
                                            </Select.Option>
                                            <Select.Option value="category2">
                                                category2
                                            </Select.Option>
                                            <Select.Option value="category3">
                                                category3
                                            </Select.Option>
                                            <Select.Option value="category4">
                                                category4
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name="price"
                                        label="Price"
                                        style={{ width: "500px", marginLeft: "16px" }}
                                        labelCol={{ span: 8 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter a price",
                                            },
                                        ]}
                                    >
                                        <InputNumber />
                                    </Form.Item>
                                </div>
                            </div>
                        )}
                        {isMobile ? (
                            <>
                                <Form.Item
                                    name="inStockQuantity"
                                    label="In Stock Quantity"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter In Stock Quantity",
                                        },
                                    ]}
                                >
                                    <InputNumber />
                                </Form.Item>{" "}
                                <Form.Item
                                    name="addImageLink"
                                    label="Add Image Link"
                                    style={{ width: isMobile ? "300px" : "500px" }}
                                    rules={[
                                        {
                                            url: true,
                                            message: "Invalid url Input",
                                        },
                                    ]}
                                >
                                    <Row gutter={1}>
                                        {/* Adjust the gutter value as needed */}
                                        <Col span={12}>
                                            <Input
                                                id="image-link-input"
                                                defaultValue="https://"
                                                placeholder="Enter link"
                                                onChange={handleImageLinkChange}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Button type="primary">Upload</Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "space-between",
                                }}
                            >
                                <Row gutter={16}>
                                    {/* Adjust the gutter value as needed */}
                                    <Col span={12}>
                                        <Form.Item
                                            name="inStockQuantity"
                                            label="In Stock Quantity"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter In Stock Quantity",
                                                },
                                            ]}
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="addImageLink"
                                            label="Add Image Link"
                                            style={{ width: isMobile ? "300px" : "300px" }}
                                            rules={[
                                                {
                                                    url: true,
                                                    message: "Invalid url Input",
                                                },
                                            ]}
                                        >
                                            <Row gutter={1}>
                                                {/* Adjust the gutter value as needed */}
                                                <Col span={12}>
                                                    <Input
                                                        id="image-link-input"
                                                        defaultValue="https://"
                                                        placeholder="Enter link"
                                                        onChange={handleImageLinkChange}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Button type="primary">Upload</Button>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        )}
                        <Form.Item>
                            {imageUrl && imageUrl !== "https://" ? (
                                <Card
                                    style={{ width: "200px", height: "200px" }}
                                    cover={
                                        <img
                                            src={imageUrl}
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                objectFit: "cover",
                                            }}
                                            alt="Image"
                                        />
                                    }
                                ></Card>
                            ) : (
                                <Card style={{ width: "200px", height: "200px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "200px",
                                        }}
                                    >
                                        <p style={{ textAlign: "center", fontSize: "18px" }}>
                                            {" "}
                                            Image Preview
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={style.btn}
                                loading={status === "pending"}
                            >
                                {buttonText}
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
}
