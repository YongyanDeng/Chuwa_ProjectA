const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: "Category1",
    },
    price: {
        type: Number,
        default: 1,
    },
    stockNum: {
        type: Number,
        default: 1,
    },
    imageUrl: {
        type: String,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
