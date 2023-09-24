const userRouter = require("express").Router();
const { login, register, verify, forgotPassword, resetPassword, addProjectTask, deleteProjectTask, deleteProfile } = require("../controllers/users");

userRouter.post("/register", register);
userRouter.patch("/verify", verify);
userRouter.post("/login", login);
userRouter.post("/forgot-password", forgotPassword);
userRouter.patch("/reset-password", resetPassword);
userRouter.post("/addProjectTask/:projectId", addProjectTask);
userRouter.delete("/deleteProjectTask/:projectId/:taskId", deleteProjectTask);
userRouter.delete("/deleteProfile/:userId", deleteProfile);

module.exports = userRouter;