import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "antd";

import AuthForm from "components/AuthForm";
import { signInUser } from "app/userSlice";
import { removeError } from "app/errorSlice";

export default function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);
    const { message: error } = useSelector((state) => state.error);
    // const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        dispatch(removeError());
    }, []);

    // Automatically redirect to home page if user's logged in
    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated]);

    const fields = [
        {
            name: "Email",
            type: "text",
            rules: [
                {
                    required: true,
                    message: "Email Cannot be empty",
                },
                {
                    type: "email",
                    message: "Invalid Email Format",
                },
            ],
        },
        {
            name: "Password",
            type: "password",
            rules: [
                {
                    required: true,
                    message: "Invalid Password Input",
                },
            ],
        },
    ];

    const onSubmit = (data) => {
        // Convert to lowercase to match database's property
        const { Email: email, Password: password } = data;
        dispatch(signInUser({ email, password }));
    };

    return (
        <div>
            <AuthForm
                buttonText="Sign in"
                onSubmit={onSubmit}
                title="Sign in to your account"
                fields={fields}
                errors={error}
                buttomText={
                    <>
                        <Typography>
                            Don't have an account? <Link to={"/signup"}>Sign up</Link>
                        </Typography>
                        <Link className="right-link" to={"/updatepassword"}>
                            Forget password?
                        </Link>
                    </>
                }
            ></AuthForm>
        </div>
    );
}
