const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// INITIALIZED EXPRESS APPLICATION
const app = express();

//DOTENV VARIABLES ADDED TO THE APPLICATION
dotenv.config({ path: "./config.env" });

require("./db/conn");
PORT = process.env.PORT;
// const User = require("./models/userSchema");

// PARSING BODYDATA TO JSON
app.use(cors());
app.use(express.json());

// ROUTER INITTIALIZED
app.use(require("./routes/router"));

// LISTENING TO THE DATABSASE
app.listen(PORT, () => {
	console.log(`listening to the port ${PORT}`);
	console.log("Your server available at http://localhost:8000");
});
