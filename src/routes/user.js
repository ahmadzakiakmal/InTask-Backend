const userRouter = require("express").Router();
const { login, register, verify, forgotPassword, resetPassword, addProjectTask, deleteProjectTask, deleteProfile, createProject, editProject } = require("../controllers/users");
const { requireJWTAuth } = require("../middlewares/auth");

userRouter.post("/register", register);
userRouter.patch("/verify", verify);
userRouter.post("/login", login);
userRouter.post("/forgot-password", requireJWTAuth, forgotPassword);
userRouter.patch("/reset-password", resetPassword);
userRouter.post("/addProjectTask/:projectId", addProjectTask);
userRouter.delete("/deleteProjectTask/:projectId/:taskId", deleteProjectTask);
userRouter.delete("/deleteProfile/:userId", deleteProfile);
userRouter.post("/createProject", createProject);
userRouter.put("/editProject/:projectId", editProject);

module.exports = userRouter;