const express = require("express");
const app = express();
const dotenv = require("dotenv");

// ? Dotenv config
dotenv.config({ path: "../config.env"});
const process = require("process");

// ? Morgan logger config
const morgan = require("morgan");
app.use(morgan("dev"));

// ? Body parser config
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ? Cookie parser config
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// ? CORS config
const cors = require("cors");
app.use(cors({origin: "*"}));

// ? DB Connection
const connectDB = require("./config/connectDB");
connectDB(process.env.MONGO_URI);

// * Start of routes

app.get("/", (req, res) => {
  res.send(`<main>
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
    p, h2 {
      text-align: center;
    }
  </style>
  <div id="logo-bg">
    <img src="https://in-task.vertech.id/InTaskLogoDark.png" alt="InTask Logo">
  </div>
  <div>
    <h2>InTask Backend</h2>
    <p>Ver 1.0</p>
  </div>
</main>`);
});

const userRouter = require("./routes/userRoutes");
app.use("/user", userRouter);

const projectRouter = require("./routes/projectRoutes");
app.use("/project", projectRouter);

const adminRouter = require("./routes/adminRoutes");
app.use("/admin", adminRouter);

// * End of routes

const port = process.env.API_PORT;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
}); 