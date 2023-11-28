const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  status: {
    type: String,
    default: "todo",
  },
  assignees: [
    {
      type: String, // assignee's username
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Task", TaskSchema);
