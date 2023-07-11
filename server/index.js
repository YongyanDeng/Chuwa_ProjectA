require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8080;
const errorHandler = require("./handlers/error");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const { loginVerify, userVerify, vendorVerify } = require("./middleware/auth");
const db = require("./models");

app.use(express.json());
app.use(cors());

// signin/signup/reset password
app.use("/api/auth", authRouter);
app.use("/api/users/:id", loginVerify, userVerify, userRouter);

// Wrong url matching
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
