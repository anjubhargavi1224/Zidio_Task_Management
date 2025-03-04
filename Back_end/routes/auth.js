const User= require("../models/User");
const router = require("express").Router();

router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    const user = await User.findOne({email : email},{username: username});
    if (user) {
        res.status(400).json("User already exists");
    } else {
        const newUserData = {
            username,
            password,
            email,
        };
        const newUser = await User.create(newUserData);
        res.status(201).json(newUser);
        console.log(newUserData);
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email: email});
    if (!user){
        res.status(400).json("User not found");
    }
    console.log(user);
    const isPasswordValid = await user.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json("Invalid credentials");
    }
});

module.exports = router;