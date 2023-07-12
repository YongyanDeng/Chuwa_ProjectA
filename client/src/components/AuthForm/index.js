import "./styles.css";
import style from "./style.module.css";

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Button, Form, Input, Typography } from "antd";
import FormItem from "antd/es/form/FormItem";

/**
 * Form for signup & signin
 * @param {String} buttonText
 * @param {function} onSubmit
 * @param {String} title
 * @param {Object} fields
 * @param {Object} errors
 */
export default function AuthForm({ buttonText, onSubmit, title, fields, errors }) {
    const { status } = useSelector((state) => state.user);
    return (
        <div className={style.FormBox}>
            <Typography.Title level={2} className={style.title}>
                {title}
            </Typography.Title>
            <Form onFinish={onSubmit} autoComplete="off">
                {fields.map((field) => (
                    <FormItem
                        key={field.name}
                        name={field.name}
                        label={field.name}
                        rules={field.rules}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        {field.type !== "password" ? (
                            <Input size="large" />
                        ) : (
                            <Input.Password size="large" />
                        )}
                    </FormItem>
                ))}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={style.btn}
                        size="large"
                        loading={status === "pending"}
                    >
                        {buttonText}
                    </Button>
                </Form.Item>
            </Form>
            <Typography>
                Already have an account? <Link>Sign in</Link>
            </Typography>
        </div>
    );
}
