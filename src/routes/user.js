const userRouter = require("express").Router();
const {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
  deleteProfile,
  updateProfile,
} = require("../controllers/users");
const { requireJWTAuth } = require("../middlewares/authentication");

userRouter.post("/register", register);
userRouter.patch("/verify", verify);
userRouter.post("/login", login);
userRouter.post("/forgot-password", requireJWTAuth, forgotPassword);
userRouter.patch("/reset-password", resetPassword);
userRouter.delete("/delete-profile/:userId", deleteProfile);
userRouter.put("/update-profile", requireJWTAuth, updateProfile);

module.exports = userRouter;
