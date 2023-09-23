const mongoose = require("mongoose");

async function connectDB(connString) {
  try {
    const conn = await mongoose.connect(connString, {
      // The following are options for the connection
      useNewUrlParser: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(err);
  }
}

module.exports = connectDB;