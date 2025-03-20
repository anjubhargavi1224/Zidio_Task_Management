import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/loginauth.js";
import { verifyToken, authorizeRoles } from "./middleware/authmiddleware.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

// Sample Public Route
app.get("/", (req, res) => {
    res.send("Todo Backend Running");
});

// Authentication Routes
app.use("/auth", authRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
