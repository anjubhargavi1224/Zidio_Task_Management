import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure this is the correct model path
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();
const router = express.Router();
// *Register Route (User & Admin)*
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with role (default to "user" if role is missing)
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        // Generate JWT Token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Registration successful",
            user: {  username: user.username, email: user.email, role: user.role, occupation: user.occupation, location: user.location, profileImage: user.profileImage},
            token
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// **Login Route (User & Admin)**
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email and include password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            user: { username: user.username, email: user.email, role: user.role, occupation: user.occupation, location: user.location, profileImage: user.profileImage },
            token
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/logout", (req, res) => {
    try {
        // Clear the token from client side
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Logout failed" });
    }
});





// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude password for security
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});




export default router;
