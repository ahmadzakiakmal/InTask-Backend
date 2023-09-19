const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  // TODO: Add project properties
  title: String,
  contributors: [{
    type: String,  //contributor's username
    ref: 'User'
  }]

});

module.exports = mongoose.model("Project", projectSchema);