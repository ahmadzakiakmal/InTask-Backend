const User = require("../models/user");
const jwt = require("jsonwebtoken");
const process = require("process");

const authorizeAdmin = (req, res, next) => {
  const cookies = req.headers.cookie;
  const Authorization = cookies.split(" ")[0];
  // console.log(Authorization);
  const token = Authorization.split("=")[1].replace(";", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ 
      message: "Invalid JWT token",
      code: 401
    });
  }

  User.findOne({ email: req.user.email })
    .then((user) => {
      if (user.role !== "admin") {
        return res.status(403).json({
          message: "Admin resource. Access denied",
          code: 403
        });
      }
      next();
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal Server Error",
        code: err.code
      });
    });
};

module.exports = {authorizeAdmin};