const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {
    type: String,
    default: "No description provided",
  },
  owner: {
    type: String, //owner's username
    ref: "User",
  },
  contributors: [
    {
      type: String, // contributor's username
      ref: "User",
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
