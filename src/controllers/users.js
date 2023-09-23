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
    subject: "Verify your account",
    html: `<h1>Verify your account</h1>
  <p>Click <a href="${process.env.API_URL}/user/verify/?token=${token}">here</a> to verify your account</p>`,
  };
  transporter
    .sendMail(mailOptions)
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

  newUser
    .save(newUser)
    .then(() => {
      return res.status(201).send({
        message: "User created successfully, please verify your email",
        code: 201,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: "Error occured while saving user to DB",
        code: err.code,
      });
    });
};

// *  User verify email
const verify = (req, res) => {
  const token = req.query.token;
  console.log(token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(500).send(
        "<h3>[400] Invalid token</h3>"
      );
    }

    const email = decoded.email;
    console.log(email);

    User.findOne({email: email})
      .then((user) => {
        user.verified = true;
        user.save()
          .then(() => {
            return res.status(200).send(`
              <h3>Account verified successfully</h3>
              <p>You can now login <a href="${process.env.CLIENT_URL}/login">here</a></p>`);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).send(
              "<h3>[500] An error occured</h3>"
            );
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send(
          "<h3>[500] An error occured</h3>"
        );
      });
  });
};

// TODO: User login
const login = (req, res) => {
  res.send("User login endpoint");
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
  register,
  verify,
  login,
};
