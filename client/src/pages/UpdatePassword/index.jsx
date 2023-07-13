import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthForm from "components/AuthForm";
import { removeError } from "app/errorSlice";
import { updatePassword } from "app/userSlice";

export default function UpdatePassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message: error } = useSelector((state) => state.error);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        dispatch(removeError());
    }, []);

    // Redirect to signin page
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
                    message: "Email Cannot be Empty",
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
        setSubmitted(true);
        // Convert to lowercase to match database's property
        const { Email: email, Password: password } = data;
        dispatch(updatePassword({ email, password }));
    };

    return (
        <div>
            <AuthForm
                buttonText="Update password"
                onSubmit={onSubmit}
                title="Update your password"
                fields={fields}
                errors={error}
            ></AuthForm>
        </div>
    );
}
