const mongoose = require("mongoose");

// DEFINNG USERSCHEMA
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    required: true,
  },
  githubusername: {
    type: String,
  },
  dribbbleusername: {
    type: String,
  },
});

// CREATING A MODEL FOR THE SCHEMA
const User = mongoose.model("USER",userSchema);

module.exports = User;

