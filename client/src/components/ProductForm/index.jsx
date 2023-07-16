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
import React, { useState } from "react";
import style from "./styles.css";
import { useSelector } from "react-redux";
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
export default function ProductForm({ buttonText, onSubmit, title }) {
    const [imageUrl, setImageUrl] = useState("");

    const { status } = useSelector((state) => state.products);
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };
    const initialValues = {
        productName: "",
        productDescription: "",
        category: "",
        price: "",
        inStockQuantity: "",
    };
    const handleImageLinkChange = (e) => {
        setImageUrl(e.target.value);
    };

    return (
        <div className={style.FormBox}>
            <Typography.Title level={2} className={style.title}>
                {title}
            </Typography.Title>
            <Form
                {...formItemLayout}
                initialValues={initialValues}
                onFinish={onSubmit}
                autoComplete="off"
                layout="vertical"
            >
                <Form.Item
                    name="productName"
                    label="Product name"
                    rules={[{ required: true, message: "Please enter new product name" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="productDescription" label="Product Description">
                    <TextArea rows={4} />
                </Form.Item>
                <Space size="large">
                    <Form.Item
                        name="category"
                        label="Category"
                        style={{ width: "400px" }}
                        labelCol={{ span: 32 }}
                    >
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        style={{ width: "500px" }}
                        labelCol={{ span: 8 }}
                    >
                        <InputNumber />
                    </Form.Item>
                </Space>
                <Form.Item>
                    <Row gutter={16}>
                        {/* Adjust the gutter value as needed */}
                        <Col span={12}>
                            <Form.Item name="inStockQuantity" label="In Stock Quantity">
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="addImageLink"
                                label="Add Image Link"
                                style={{ width: "500px" }}
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
                </Form.Item>
                <Form.Item>
                    {imageUrl && imageUrl !== "https://" ? (
                        <Card
                            style={{ width: "200px", height: "200px" }}
                            cover={
                                <img
                                    src={imageUrl}
                                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
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
        </div>
    );
}
