const express = require ("express");
const dotenv = require ("dotenv");
const mongoose = require ("mongoose");
const cors = require ("cors");
const authRoutes = require ("./routes/loginauth.js");
const taskRoutes = require("./routes/taskRoutes.js");


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

// Task Routes
app.use('/tasks', taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
