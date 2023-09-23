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

// TODO: User login
const login = (req, res) => {
  res.send("User login endpoint");
};

// TODO: User register
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
  const check = await User.findOne({ $or : [{username: username}, {email: email}]});
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

  newUser
    .save(newUser)
    .then(() => {
      // Send verification email
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Verify your account",
        html: `<h1>Verify your account</h1>
      <p>Click <a href="http://localhost:3000/user/verify/${token}">here</a> to verify your account</p>`,
      };
      transporter.sendMail(mailOptions)
        .then(() => {
          console.log(`Email sent to ${email}`);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({
            message: "Error occured while sending email",
            code: err.code,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: "Error occured while saving user to DB",
        code: err.code,
      });
    });

  return res.status(201).send({
    message: "User created successfully, please verify your email",
    code: 201,
  });
};

// TODO: User logout

// TODO: User update profile

// TODO: User delete profile

// TODO: Create project

// TODO: Add project task

// TODO: Edit project task

// TODO: Delete project task

// TODO: Change project task status

module.exports = {
  login,
  register,
};
