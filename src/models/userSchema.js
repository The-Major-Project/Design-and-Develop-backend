const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// HASHING THE CREDENTIALS
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// GENERATING AUTHORIZATION TOKEN
userSchema.methods.generateAuthToken = async function () {
  try {
    // GENERATING AUTH TOKEN
    let token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);

    // ADDING TOKEN TO DATABASE
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    console.log("token IS : " + token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

// CREATING A MODEL FOR THE SCHEMA
const User = mongoose.model("USER", userSchema);

module.exports = User;
