const User = require("../models/user");
const Project = require("../models/project");

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
      message: "User already exists",
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
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "InTask Account Verification",
    html: `<h1>Verify your account</h1>
  <p>Click <a href="${process.env.CLIENT_URL}/auth/verify/?token=${token}">here</a> to verify your account</p>`,
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

  return res.status(200).send({
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

// TODO: User update profile

// TODO: User delete profile
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

// TODO: Create project

// TODO: Add project task
const addProjectTask = async (req, res) => {
  const projectId = req.params.projectId;
  const tasks = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project Not Found!" });
    }
    project.tasks.push(tasks);
    await project.save();

    res.status(200).json({ message: "Task Successfully Added to Project" });
  } catch (err) {
    res.status(500).json(err);
  }
};
// TODO: Edit project task

// TODO: Delete project task
const deleteProjectTask = async (req, res) => {
  const projectId = req.params.projectId;
  const taskId = req.params.taskId;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project Not Found!" });
    }

    const taskIndex = project.tasks.findIndex((task) => task.equals(taskId));

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task Not Found In Project!" });
    }

    project.tasks.splice(taskIndex, 1);
    await project.save();

    res.status(200).json({ message: "Task Successfully Deleted from Project" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// TODO: Change project task status

module.exports = {
  register,
  verify,
  login,
  forgotPassword,
  resetPassword,
  addProjectTask,
  deleteProjectTask,
  deleteProfile,
};
