const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();


// **Admin Signup**
router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Check if admin already exists
        const Admin = await User.findOne({ email: normalizedEmail, role: "admin" });
        if (Admin) {
            return res.status(400).json({ error: "Admin already exists" });
        }else{

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const newAdmin = await User.create({
            username,
            password: hashedPassword,
            email: normalizedEmail,
            role: "admin", // Set role as admin
        });

        res.status(201).json({ message: "Admin registered successfully" });
    }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// **Admin Login**
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Check if admin exists
        const admin = await User.findOne({ email: normalizedEmail, role: "admin" }).select("+password");
        if (!admin) {
            return res.status(400).json({ error: "Admin not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        
         // Send admin details in response

        res.status(200).json({
            message: "Admin login successful",
            user: { username: admin.username, email: admin.email, role: admin.role },
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;