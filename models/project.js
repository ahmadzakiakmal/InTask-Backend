const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  // TODO: Add project properties
});

module.exports = mongoose.model("Project", projectSchema);