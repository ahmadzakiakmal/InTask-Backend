const jwt = require("jsonwebtoken");
const process = require("process");

const JWTAuthentication = (req, res, next) => {
  const cookies = req.headers.cookie;
  console.log(cookies);
  if(!cookies) {
    return res.status(401).json({
      message: "JWT token is missing",
      code: 401
    });
  }
  if (!cookies.includes("Authorization=")) {
    return res.status(401).json({
      message: "JWT token is missing",
      code: 401,
    });
  }
  try {
    const Authorization = cookies.split(" ")[0];
    // console.log(Authorization);
    const token = Authorization.split("=")[1].replace(";", "");
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      message: "Invalid JWT token",
      code: 401,
    });
  }

  next();
};

module.exports = { JWTAuthentication };
