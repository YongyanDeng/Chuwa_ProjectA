import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthForm from "components/AuthForm";
import { logOut, signUpUser } from "app/userSlice";
import { removeError } from "app/errorSlice";

export default function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message: error } = useSelector((state) => state.error);
    const [submitted, setSubmitted] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.user);

    // Log out current user every time in this page
    if (isAuthenticated) dispatch(logOut());

    useEffect(() => {
        dispatch(removeError());
    }, []);

    // Show error if error !== null
    useEffect(() => {
        if (submitted && !error) navigate("/signin");
    }, [error]);

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
        setSubmitted(true);
        // Convert to lowercase to match database's property
        const { Email: email, Password: password } = data;
        dispatch(signUpUser({ email, password }));
    };

    return (
        <div>
            <AuthForm
                buttonText="Create account"
                onSubmit={onSubmit}
                title="Sign up an account"
                fields={fields}
                errors={error}
            ></AuthForm>
        </div>
    );
}
