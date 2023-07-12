import React from "react";

import AuthForm from "components/AuthForm";

export default function SignUp() {
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
        console.log(data);
    };

    return (
        <div>
            <AuthForm
                buttonText="Create account"
                onSubmit={onSubmit}
                title="Sign up an account"
                fields={fields}
            ></AuthForm>
        </div>
    );
}
