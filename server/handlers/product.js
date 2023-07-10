const db = require("../models");

// Get all products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await db.Product.find();
        return res.status(200).json(products);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

// Get an product by id
const getOneProduct = async (req, res, next) => {
    try {
        const product = await db.Product.findById(req.params?.productId);
        return res.status(200).json(product);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

// Create an new product - only vendor
const createProduct = async (req, res, next) => {
    try {
        const product = await db.Product.create({
            ...req.body,
            createdBy: req.params.id,
        });
        // Find the vendor and save product into vendor's stock
        const vendor = await db.User.findById(req.params.id);
        if (!vendor) {
            return res.status(401).json({ error: "Vendor do not exist" });
        }
        vendor.stock.push(product.id);
        // save vendor
        await vendor.save();
        const newProduct = await db.Product.findById(product.id).populate(
            "createdBy",
            {
                username: true,
                avatarUrl: true,
                category: true,
            }
        );
        return res.status(200).json({ newProduct });
    } catch (err) {
        if (err.code === 11000)
            err.message = "Sorry, this product'name is taken!";
        return next({
            status: 400,
            message: err.message,
        });
    }
};

// Update an product by id
const updateProduct = async (req, res, next) => {
    try {
        const product = await db.Product.findByIdAndUpdate(
            req.params?.productId,
            req.body,
            {
                new: true,
            }
        );
        if (!product) {
            return res.status(401).json({ error: "Product not found" });
        }
        await product.save();
        return res.json(product);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

// Delete an product by id
const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await db.Product.findById(req.params?.productId);
        await deletedProduct.deleteOne();
        return res.status(204).json(deletedProduct);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

const getAllCartProducts = async (req, res, next) => {
    try {
        const user = await db.User.findById(req.params.id);
        if (!user) {
            return res.status(401).json({ error: "User do not exist" });
        }
        const cart = user.cart;
        return res.status(200).json(cart);
    } catch (err) {
        return next(err);
    }
};

const addProductToCart = async (req, res, next) => {
    try {
        // find the user
        const user = await db.User.findById(req.params.id);
        if (!user) {
            return res.status(401).json({ error: "User do not exist" });
        }

        // find the product
        const quantity = req.body.quantity;
        const product = await db.Product.findById(req.body.productId);
        if (!product || !product.stockNum) {
            return res.status(401).json({ error: "Product not found" });
        } else if (product.stockNum < quantity) {
            return res
                .status(401)
                .json({ error: "Insufficient stock of this product" });
        }

        // add product into cart
        if (user.cart.has(product.id)) {
            const currQuantity = user.cart.get(product.id);
            user.cart.set(product.id, currQuantity + quantity);
        } else user.cart.set(product.id, quantity);

        // save user
        await user.save();
        return res.status(200).json(product);
    } catch (err) {
        return next(err);
    }
};

const getProductByIdInCart = async (req, res, next) => {
    try {
        const user = await db.User.findById(req.params.id);
        if (!user) {
            return res.status(401).json({ error: "User do not exist" });
        }
        if (user.cart.has(req.params.productId)) {
            const product = await db.Product.findById(req.params.productId);
            if (!product || !product.stockNum) {
                return res
                    .status(401)
                    .json({ error: "No such product in stock" });
            }
            return res.status(200).json({
                product: product.name,
                quantity: user.cart.get(req.params.productId),
            });
        } else {
            return res.status(201).json({ error: "No such product in cart" });
        }
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllCartProducts,
    addProductToCart,
    getProductByIdInCart,
};
