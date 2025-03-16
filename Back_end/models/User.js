const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Removes extra spaces
    },
    password: {
        type: String,
        required: true,
        select: false, // Prevents password from being returned in queries
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Converts email to lowercase for consistency
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"], // Only allow these two roles
        default: "user", // Default role is "user"
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
