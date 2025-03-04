const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
    });
    const Usermodel = mongoose.model("User", User);
    module.exports = Usermodel;