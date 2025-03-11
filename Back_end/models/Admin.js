const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
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
        
    },
    role:{
        type: String,
        required: true,
        enum: ["user", "admin"],
        unique:true,
    }
    });
    const Adminmodel = mongoose.model("Admin", Admin);
    module.exports = Adminmodel;