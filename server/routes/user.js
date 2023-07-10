const express = require("express");
const {
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
} = require("../handlers/product");
const router = express.Router({ mergeParams: true });
const { loginVerify, userVerify, vendorVerify } = require("../middleware/auth");

//  prefix: /api/users/:id
router.get("/products", getAllProducts);
router.post("/products", vendorVerify, createProduct);

router.get("/products/:productId", getOneProduct);
router.put("/products/:productId", vendorVerify, updateProduct);
router.delete("/products/:productId", vendorVerify, deleteProduct);

router.get("/cart", getAllCartProducts);
router.post("/cart", addProductToCart);

router.get("/cart/:productId", getProductByIdInCart);
router.put("/cart/:productId", updateProductQuantityInCart);
router.delete("/cart/:productId", removeProductInCart);

module.exports = router;
