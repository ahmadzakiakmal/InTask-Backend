const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  // TODO: Add project properties
  title: String,
  description: String,
  owner: {
    type: String,  //owner's username
    ref: "User"
  },
  contributors: [{
    type: String,  //contributor's username
    ref: "User"
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("Project", projectSchema);