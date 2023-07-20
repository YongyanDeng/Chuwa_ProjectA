const mongoose = require("mongoose");
const User = require("./user");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "None",
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
        default: "https://m.media-amazon.com/images/I/61RNOxTPxuL._AC_SY450_.jpg",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: { type: Date, default: Date.now, readonly: true },
});

productSchema.pre("deleteOne", { document: true }, async function (next) {
    try {
        // find the vendor
        const vendor = await User.findById(this.createdBy);
        // remove the id of this product from vendor's stock
        vendor.stock.remove(this.id);
        await vendor.save();
        return next();
    } catch (err) {
        return next(err);
    }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
