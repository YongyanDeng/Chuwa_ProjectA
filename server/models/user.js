const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (emailInput) {
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                return emailRegex.test(emailInput);
            },
            message: "Invalid Email format",
        },
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        default: "USER",
    },
    avatarUrl: {
        type: String,
        default: "https://source.unsplash.com/collection/{collectionId}/160x160",
    },
    category: {
        type: String,
        default: "USER",
    },
    cart: {
        type: Map,
        of: Number,
        default: new Map(),
        validate: {
            validator: function (value) {
                for (const key of value.keys()) {
                    if (!mongoose.Types.ObjectId.isValid(key)) return false;
                }
                return true;
            },
        },
    },
    stock: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

// encrypt password
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

// vendor category
userSchema.pre("save", async function (next) {
    try {
        if (this.email.includes("@vendor.com")) {
            this.category = "VENDOR";
            this.username = "VENDOR";
        }
        return next();
    } catch (err) {
        return next(err);
    }
});

// password matching
userSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        return next(err);
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
