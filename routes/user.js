const userRouter = require("express").Router();
const { login, register } = require("../controllers/users");

userRouter.post("/login", login);
userRouter.post("/register", register);

module.exports = userRouter;