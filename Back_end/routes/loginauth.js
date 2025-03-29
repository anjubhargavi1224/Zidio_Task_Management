const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth.js");
const User = require("../models/User.js"); // Ensure this is the correct model path
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

        // Send response with token and user details
        res.status(201).json({
            message: "Registration successful",
            user: { username: newUser.username, email: newUser.email, role: newUser.role },
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


// **Forgot Password Route**
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Set token and expiration (expires in 1 hour)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: "your-email@gmail.com", pass: "your-password" },
        });

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: "no-reply@zidio.com",
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset.</p>
                   <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
                   <p>This link is valid for 1 hour.</p>`,
        });

        res.json({ message: "Password reset link sent to email." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// **Reset Password Route**
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Find user by token and check if it's still valid
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Password reset successful. You can now log in!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/update-profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, occupation, location, profileImage, socialLinks  } = req.body;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user details
        user.username = username || user.username;
        user.email = email || user.email;
        user.occupation = occupation || user.occupation;
        user.location = location || user.location;
        user.profileImage = profileImage || user.profileImage;
        user.socialLinks = socialLinks || user.socialLinks;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete("/delete-user/:id", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized: Only admins can delete users" });
        }

        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});





module.exports = router;