const userRouter = require("express").Router();
const {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
  deleteProfile,
  updateProfile,
  searchUser
} = require("../controllers/userControllers");
const { JWTAuthentication } = require("../middlewares/authentication");

userRouter.post("/register", register);
userRouter.patch("/verify", verify);
userRouter.post("/login", login);
userRouter.post("/forgot-password", JWTAuthentication, forgotPassword);
userRouter.patch("/reset-password", JWTAuthentication, resetPassword);
userRouter.delete("/delete-profile/:userId", JWTAuthentication, deleteProfile);
userRouter.put("/update-profile", JWTAuthentication, updateProfile);
userRouter.post("/search", JWTAuthentication, searchUser);

module.exports = userRouter;
