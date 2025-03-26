const express = require("express");
const crypto = require("crypto");
const bcrypt = require ("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User.js");

const router = express.Router();

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

module.exports =  router;

