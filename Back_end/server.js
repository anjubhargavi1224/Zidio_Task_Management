import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/loginauth.js";
import taskRoutes from "./routes/taskRoutes.js";
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
    res.send("Zidio Task Management Backend is Running");
});

// Authentication Routes
app.use("/auth", authRoutes);

// task routes
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));