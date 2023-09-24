const userRouter = require("express").Router();
const { login, register, verify, forgotPassword, resetPassword } = require("../controllers/users");

userRouter.post("/register", register);
userRouter.get("/verify", verify);
userRouter.post("/login", login);
userRouter.post("/forgot-password", forgotPassword);
userRouter.patch("/reset-password", resetPassword);


module.exports = userRouter;