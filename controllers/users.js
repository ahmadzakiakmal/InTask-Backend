const User = require("../models/user");

// ! TEST ONLY
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

// TODO: User login



// TODO: User register



// TODO: User logout



// TODO: User update profile



// TODO: User delete profile



// TODO: Create project



// TODO: Add project task



// TODO: Edit project task



// TODO: Delete project task



// TODO: Change project task status



module.exports = {
  getAllUsers,
};