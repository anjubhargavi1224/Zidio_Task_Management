const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  description: String,
  startDate: String,
  endDate: String,
  status: String,
});

module.exports = mongoose.model('Task', taskSchema);
