const User = require("../models/user");

// ? Required packages
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// ? Nodemailer Config
const process = require("process");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// * User register
const register = async (req, res) => {
  const { username, realName, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !realName || !email || !password) {
    return res.status(400).send({
      message: "Please provide all fields",
      code: 400,
    });
  }

  // Check if user already exists
  const check = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (check) {
    return res.status(400).send({
      message: "Email or username is already taken",
      code: 400,
    });
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt, (err) => {
    if (err) {
      return res.status(500).send({
        message: "Error occured while hashing password",
        code: err.code,
      });
    }
  });

  // Sign JWT
  const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Create new user
  const newUser = new User({
    username: username,
    realName: realName,
    email: email,
    password: hashedPassword,
    salt: salt,
    role: "user",
    verified: false,
  });

  const mailOptions = {
    from: `InTask <${process.env.NODEMAILER_EMAIL}`,
    to: email,
    subject: "InTask Account Verification",
    html: `<main>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
      main{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        font-family: 'Poppins', sans-serif;
        color: #1B2430;
      }
      img {
        width: 200px;
      }
    </style>
    <div id="logo-bg">
      <img src="https://in-task.vertech.id/InTaskLogoDark.png" alt="InTask Logo">
    </div>
    <div>
      <h2>Verify Your Account</h2>
      <div>Click <a href="${process.env.CLIENT_URL}/auth/verify/?token=${token}">here</a> to verify your account</div>
    </div>
  </main>`,
  };
  transporter.sendMail(mailOptions).catch((err) => {
    return res.status(500).send({
      message: "Error occured while sending email",
      code: err.code,
    });
  });

  newUser
    .save(newUser)
    .then(() => {
      return res.status(201).send({
        message: "User created successfully, please verify your email",
        code: 201,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error occured while saving user to DB",
        code: err.code,
      });
    });
};

// *  User verify email
const verify = (req, res) => {
  const token = req.query.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        message: "Invalid token",
        code: err.code,
      });
    }

    const email = decoded.email;

    User.findOne({ email: email })
      .then((user) => {
        user.verified = true;
        user
          .save()
          .then(() => {
            return res.status(200).send({
              message: "User verified successfully",
              code: 200,
            });
          })
          .catch(() => {
            return res.status(500).send({
              message: "Error occured while saving user to DB",
              code: err.code,
            });
          });
      })
      .catch(() => {
        return res.status(500).send({
          message: "Error occured while finding user in DB",
          code: err.code,
        });
      });
  });
};

// * User login
const login = async (req, res) => {
  const { identifier, password } = req.body;

  // Check if all fields are provided
  if (!identifier || !password) {
    return res.status(400).send({
      message: "Please provide all fields",
      code: 400,
    });
  }

  // Check if user exists
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  if (!user) {
    return res.status(404).send({
      message: "User does not exist",
      code: 404,
    });
  }

  // Check if user is verified
  if (!user.verified) {
    return res.status(403).send({
      message: "User is not verified",
      code: 403,
    });
  }

  // Check if password is correct
  const hashedPassword = bcrypt.hashSync(password, user.salt);
  if (hashedPassword !== user.password) {
    return res.status(401).send({
      message: "Incorrect password",
      code: 401,
    });
  }

  // Sign JWT
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  return res
    .cookie("Authorization", token)
    .status(200)
    .send({
      message: "User logged in successfully",
      code: 200,
      token: token,
      data: {
        username: user.username,
        realName: user.realName,
        email: user.email,
        role: user.role,
      },
    });
};

// * User forgot password
const forgotPassword = async (req, res) => {
  const { identifier } = req.body;

  // Check if all fields are provided
  if (!identifier) {
    return res.status(400).send({
      message: "Please provide all fields",
      code: 400,
    });
  }

  // Check if user exists
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  if (!user) {
    return res.status(404).send({
      message: "User does not exist",
      code: 404,
    });
  }

  // Sign JWT
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Send email
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: user.email,
    subject: "Reset your password",
    html: `<h1>Reset your password</h1>
  <p>Click <a href="${process.env.API_URL}/user/reset-password/?token=${token}">here</a> to reset your password</p>`,
  };
  transporter
    .sendMail(mailOptions)
    .then(() => {
      return res.status(200).send({
        message: "Email sent successfully",
        code: 200,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error occured while sending email",
        code: err.code,
      });
    });
};

// * User reset password
const resetPassword = async (req, res) => {
  const token = req.query.token;
  const { password } = req.body;

  // Check if token is provided
  if (!token) {
    return res.status(400).send({
      message: "Please provide token",
      code: 400,
    });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        message: "Invalid token",
        code: err.code,
      });
    }

    const email = decoded.email;

    // Check if user exists
    User.findOne({ email: email })
      .then((user) => {
        // Check if user is verified
        if (!user.verified) {
          return res.status(403).send({
            message: "User is not verified",
            code: 403,
          });
        }

        // Check if password is provided
        if (!password) {
          return res.status(400).send({
            message: "Please provide password",
            code: 400,
          });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Update password
        user.password = hashedPassword;
        user.salt = salt;
        user
          .save()
          .then(() => {
            return res.status(200).send({
              message: "Password updated successfully",
              code: 200,
            });
          })
          .catch((err) => {
            return res.status(500).send({
              message: "Error occured while saving user to DB",
              code: err.code,
            });
          });
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Error occured while finding user in DB",
          code: err.code,
        });
      });
  });
};

// * User update profile
const updateProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const { username, realName } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email },
      { username, realName }
    );
    res.status(201).json({ message: "User Profile updated", user });
  } catch (err) {
    res.status(500).json(err);
  }
};

// * User delete profile
const deleteProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Profile Successfully Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  register,
  verify,
  login,
  forgotPassword,
  resetPassword,
  deleteProfile,
  updateProfile,
};
