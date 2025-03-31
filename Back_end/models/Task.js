const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "inprogress", "completed"],
        default: "inprogress"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ] // Now allows multiple users
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
