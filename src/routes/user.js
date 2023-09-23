const userRouter = require("express").Router();
const { login, register, verify } = require("../controllers/users");

userRouter.post("/register", register);
userRouter.get("/verify", verify);
userRouter.post("/login", login);

module.exports = userRouter;