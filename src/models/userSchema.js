const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// HASHING THE CREDENTIALS
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// CREATING A MODEL FOR THE SCHEMA
const User = mongoose.model("USER", userSchema);

module.exports = User;
