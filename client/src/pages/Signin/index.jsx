import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthForm from "components/AuthForm";
import { signInUser } from "app/userSlice";
import { removeError } from "app/errorSlice";

export default function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);
    const { message: error } = useSelector((state) => state.error);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        dispatch(removeError());
    }, []);

    // Show error if error !== null
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
                    message: "Invalid Email Input",
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
        dispatch(signInUser({ email, password })).then(() => setSubmitted(true));
    };

    return (
        <div>
            <AuthForm
                buttonText="Sign in"
                onSubmit={onSubmit}
                title="Sign in to your account"
                fields={fields}
                errors={error}
            ></AuthForm>
        </div>
    );
}
