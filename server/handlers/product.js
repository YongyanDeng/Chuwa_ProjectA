const db = require("../models");
const { acquireCartLock, releaseCartLock } = require("./cartLock");

/**
 * Get all products in stock
 * @return {Product[]} All_Product_In_Stock
 */
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

/**
 * Get an product selected by id
 * @return {Product} Selected_Product_info
 */
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

/**
 * Create an new product - vendor only
 * @return {Product} New_Product_info
 */
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

        const newProduct = await db.Product.findById(product.id).populate("createdBy", {
            username: true,
            avatarUrl: true,
            category: true,
        });
        return res.status(200).json({ newProduct });
    } catch (err) {
        if (err.code === 11000) err.message = "Sorry, this product'name is taken!";
        return next({
            status: 400,
            message: err.message,
        });
    }
};

/**
 * Update an product selected by id - vendor & creator only
 * @return {Product} Updated_Product_info
 */
const updateProduct = async (req, res, next) => {
    try {
        const product = await db.Product.findByIdAndUpdate(req.params?.productId, req.body, {
            new: true,
        });
        if (!product) {
            return res.status(401).json({ error: "Product not found" });
        }

        // verify if this product belongs to vendor's stock
        if (product.createdBy.toString() !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized to modify this product" });
        }

        return res.json(product);
    } catch (err) {
        if (err.code === 11000) err.message = "Sorry, this product'name is taken!";
        return next({
            status: 500,
            message: err.message,
        });
    }
};

/**
 * Delete an product selected by id - vendor & creator only
 * @return {Product} Deleted_Product_info
 */
const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await db.Product.findById(req.params?.productId);
        if (!deletedProduct) {
            return res.status(401).json({ error: "Product not found" });
        }

        // verify if this product belongs to vendor's stock
        if (deletedProduct.createdBy.toString() !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized to modify this product" });
        }

        await deletedProduct.deleteOne();
        return res.status(204).json(deletedProduct);
    } catch (err) {
        return next({
            status: 500,
            message: err.message,
        });
    }
};

/**
 * Add a products selected by productId into user's cart
 * @return {id, username, category, avatarUrl, cart} User_info
 */
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
        // Check if purchase quantity <= stock quantity
        if (!product || !product.stockNum) {
            return res.status(401).json({ error: "Product not found" });
        } else if (product.stockNum < quantity) {
            return res.status(401).json({ error: "Insufficient stock of this product" });
        }

        // add product into cart
        if (user.cart.has(product.id)) {
            const currQuantity = user.cart.get(product.id);
            if (product.stockNum < currQuantity + quantity) {
                return res.status(401).json({
                    error: "Insufficient stock of this product",
                });
            }
            user.cart.set(product.id, currQuantity + quantity);
        } else {
            user.cart.set(product.id, quantity);
        }

        // save user
        await user.save();

        const { id, username, category, avatarUrl, cart } = user;
        return res.status(200).json({
            id,
            username,
            category,
            avatarUrl,
            cart,
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Get all products selected by productId in user's cart
 * @return {Product[]} User_cart
 */
const getAllCartProducts = async (req, res, next) => {
    try {
        const user = await db.User.findById(req.params.id);
        if (!user) {
            return res.status(401).json({ error: "User do not exist" });
        }
        const cart = [];
        for (const [key, value] of user.cart) {
            const product = await db.Product.findById(key).populate("createdBy");
            const { id, name, description, price, imageUrl, stockNum, createdBy } = product;
            cart.push({
                id: id,
                name: name,
                description: description,
                price: price,
                quantity: value,
                imageUrl: imageUrl,
                stockNum,
                vendor: {
                    id: createdBy.id,
                    username: createdBy.username,
                    avatarUrl: createdBy.avatarUrl,
                },
            });
        }
        return res.status(200).json(cart);
    } catch (err) {
        return next(err);
    }
};

/**
 * Get a product selected by productId in user's cart
 * @return {id, name, description, price, quantity, imageUrl, vendor} Product_info
 */
const getProductByIdInCart = async (req, res, next) => {
    try {
        const user = await db.User.findById(req.params.id);
        if (!user) {
            return res.status(401).json({ error: "User do not exist" });
        }

        if (user.cart.has(req.params.productId)) {
            const product = await db.Product.findById(req.params.productId).populate("createdBy");
            if (!product || !product.stockNum) {
                return res.status(401).json({ error: "No such product in stock" });
            }
            const { id, name, description, price, imageUrl, createdBy } = product;
            return res.status(200).json({
                id: id,
                name: name,
                description: description,
                price: price,
                quantity: user.cart.get(req.params.productId),
                imageUrl: imageUrl,
                vendor: {
                    id: createdBy.id,
                    username: createdBy.username,
                    avatarUrl: createdBy.avatarUrl,
                },
            });
        } else {
            return res.status(201).json({ error: "No such product in cart" });
        }
    } catch (err) {
        return next(err);
    }
};

/**
 * Update quantity of a product selected by productId in user's cart
 * @return {id, username, category, avatarUrl, cart} User_info
 */
const updateProductQuantityInCart = async function (req, res, next) {
    try {
        const user = await db.User.findById(req.params.id);
        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        }

        // lock cart for multi fast update
        const cartLock = await acquireCartLock(req.params.id);

        if (user.cart.has(req.params.productId)) {
            const quantity = req.body.quantity;

            // // Check this product in stock
            // const product = await db.Product.findById(req.params.productId).populate("createdBy");
            // if (!product) {
            //     return res.status(401).json({ error: "Product does not exist anymore" });
            // }

            // // If quantity is larger than stock num, reject update
            // if (!quantity || quantity > product.stockNum) {
            //     return res.status(401).json({
            //         error: "Insufficient stock of this product",
            //     });
            // }
            user.cart.set(req.params.productId, quantity);

            // save user
            await user.save();

            // release lock
            await releaseCartLock(req.params.id, cartLock);

            const { id, username, category, avatarUrl, cart } = user;

            return res.status(200).json({
                id,
                username,
                category,
                avatarUrl,
                cart,
            });
        } else {
            await releaseCartLock(req.params.id, cartLock);
            // release lock
            return res.status(201).json({ error: "No such product in cart" });
        }
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a product selected by productId in user's cart
 * @return {id, username, category, avatarUrl, cart} User_info
 */
const removeProductInCart = async function (req, res, next) {
    try {
        const user = await db.User.findById(req.params.id);

        if (!user) {
            return res.status(401).json({ error: "User do not exist" });
        }
        if (!user.cart.has(req.params.productId)) {
            return res.status(201).json({ error: "No such product in cart" });
        }

        // delete productId in user's cart
        user.cart.delete(req.params.productId);

        // save user
        await user.save();

        const currentCart = [];
        for (const [key, value] of user.cart) {
            const product = await db.Product.findById(key).populate("createdBy");
            const { id, name, description, price, imageUrl, stockNum, createdBy } = product;
            currentCart.push({
                id,
                name,
                description,
                price,
                quantity: value,
                imageUrl: imageUrl,
                stockNum,
                vendor: {
                    id: createdBy.id,
                    username: createdBy.username,
                    avatarUrl: createdBy.avatarUrl,
                },
            });
        }

        const { id, username, category, avatarUrl } = user;
        return res.status(200).json({
            id,
            username,
            category,
            avatarUrl,
            cart: currentCart,
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * Calculate total price of chosenProducts in req.body
 * Check and minus chosenProduct's quantity from product's stockNum
 * @return {Product[]} checkoutProducts
 * @return {number} totalPrice
 */
const checkout = async function (req, res, next) {
    try {
        // find user
        const user = await db.User.findById(req.params.id);

        if (user.cart.size === 0) {
            return res.status(200).json({
                message: `Your cart is empty. Let's go shopping!`,
            });
        }

        // update stock
        const charge = +req.body.charge;
        for (const [productId, quantity] of user.cart) {
            // Find this product in Stock
            const product = await db.Product.findById(productId);
            if (!product) {
                return res.status(401).json({
                    error: `No such product in Stock`,
                });
            } else if (product.stockNum < quantity) {
                return res.status(401).json({
                    error: `Insufficient Inventory`,
                });
            }

            // Update stock and calculate total price
            user.cart.delete(productId);

            await product.save();
        }
        await user.save();
        return res.status(200).json({
            message: `Total charge: $ ${charge}. Thank you for your shopping!`,
        });
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
    updateProductQuantityInCart,
    removeProductInCart,
    checkout,
};
