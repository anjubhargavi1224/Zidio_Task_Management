const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();

router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json("User already exists");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserData = {
                username,
                password: hashedPassword,
                email,
            };
            const newUser = await User.create(newUserData);
            res.status(201).json(newUser);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json("Invalid credentials");
        }

        // Send user details in response
        res.status(200).json({
            message: "Login successful",
            user: { username: user.username, email: user.email },
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;