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
            {errors ? <Typography className={style.error}>{errors}</Typography> : null}
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
            {buttonText.includes("Create account") ? (
                <div className="buttomText">
                    <Typography>
                        Already have an account? <Link to={"/signin"}>Sign in</Link>
                    </Typography>
                </div>
            ) : (
                <div className="buttomText">
                    <Typography>
                        Don't have an account? <Link to={"/signup"}>Sign up</Link>
                    </Typography>
                    <Link className="right-link">Forget password?</Link>
                </div>
            )}
        </div>
    );
}
