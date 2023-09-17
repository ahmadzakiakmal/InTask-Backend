const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env"});
const process = require("process");
const morgan = require("morgan");
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("<h1>InTask Backend</h1>");
});

const port = process.env.API_PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});