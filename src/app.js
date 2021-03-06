const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const postRouter = require("./routes/Posts");
const chatRouter = require("./routes/Chat");

// INITIALIZED EXPRESS APPLICATION
const app = express();

//DOTENV VARIABLES ADDED TO THE APPLICATION
dotenv.config({ path: "./config.env" });

require("./db/conn");
PORT = process.env.PORT;
// const User = require("./models/userSchema");

// PARSING BODYDATA TO JSON
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ROUTER INITTIALIZED
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/chat", chatRouter);

// LISTENING TO THE DATABSASE
app.listen(PORT, () => {
  console.log(`listening to the port ${PORT}`);
  console.log("Your server available at http://localhost:8000");
});
