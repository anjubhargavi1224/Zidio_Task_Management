import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/authmiddleware.js";
import User from "../models/User.js"; // Ensure this is the correct model path
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// **Register Route (User & Admin)**
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

        res.status(201).json({ message: "Registration successful", user: { username, email, role } });

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
            user: { username: user.username, email: user.email, role: user.role },
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

// Route to get logged-in user's profile info
router.get("/me", verifyToken, async (req, res) => {
    try {
        const {fullName, email, occupation, location, socialLinks, profilePic} = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                fullName,
                email,
                occupation,
                location,
                socialLinks,
                profilePic
            },
            {new: true} //return updated document
        ).select("_password"); //exclude password

        if(!updatedUser){
            return res.status(404).json({error: "user not found"});
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
