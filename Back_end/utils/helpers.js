const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

export const getToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role, // Store role in token
    },
    process.env.JWT_SECRET || "defaultSecretKey", // Use environment variable
    { expiresIn: "7d" } // Set token expiration time (7 days)
  );
};
