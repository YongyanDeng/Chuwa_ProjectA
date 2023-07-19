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

app.get("/api/products", loginVerify, userVerify, async function (req, res, next) {
    try {
        const Products = await db.Product.find().sort({ createdAt: "desc" }).populate("createdBy", {
            username: true,
            avatarUrl: true,
        });
        return res.status(200).json(Products);
    } catch (err) {
        return next(err);
    }
});

app.get("/api/products/:productId", loginVerify, async (req, res, next) => {
    try {
        const product = await db.Product.findById(req.params?.productId);
        return res.status(200).json(product);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
});

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
