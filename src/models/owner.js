const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema({
  // TODO: Add owner properties
});

module.exports = mongoose.model("Owner", OwnerSchema);