const userRouter = require("express").Router();
const { login, register, verify, forgotPassword, resetPassword, addProjectTask, deleteProjectTask, deleteProfile, createProject, editProject, updateProfile, updateTaskStatus } = require("../controllers/users");
const { requireJWTAuth } = require("../middlewares/authentication");

userRouter.post("/register", register);
userRouter.patch("/verify", verify);
userRouter.post("/login", login);
userRouter.post("/forgot-password", requireJWTAuth, forgotPassword);
userRouter.patch("/reset-password", resetPassword);
userRouter.post("/add-project-task/:projectId", addProjectTask);
userRouter.delete("/delete-project-task/:projectId/:taskId", deleteProjectTask);
userRouter.delete("/delete-profile/:userId", deleteProfile);
userRouter.post("/create-project", createProject);
userRouter.put("/edit-project/:projectId", editProject);
userRouter.put("/update-profile", requireJWTAuth, updateProfile);
userRouter.put("/update-task-status/:taskId/:status", updateTaskStatus);

module.exports = userRouter;