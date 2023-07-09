const Product = require("../models/product");

// Get all products
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Get an product by id
const getOneProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params?.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Create an new product
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        await product.save();
        return res.status(201).json({ message: "product created" });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Update an product by id
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params?.id,
            req.body,
            {
                new: true,
            }
        );
        if (!product) {
            return res.status(404).json({ error: "product not found" });
        }
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// Delete an product by id
const deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params?.id);
        res.status(204).json({ message: "product deleted" });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
