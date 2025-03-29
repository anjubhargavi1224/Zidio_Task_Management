const jwt = require("jsonwebtoken");
const User = require( "../models/User.js");
const dotenv = require("dotenv");

dotenv.config();

// Middleware to verify JWT token
 const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(403).json({ error: "Access denied" });

        const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = await User.findById(verified.id).select("-password"); // Attach user to request
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// Middleware to check if user is admin
 const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};

module.exports = { verifyToken, isAdmin };  