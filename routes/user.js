const userRouter = require("express").Router();
const { getAllUsers } = require("../controllers/users");

userRouter.get("/", getAllUsers);

module.exports = userRouter;