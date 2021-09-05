const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const router = express.Router();
const User = require("./../models/userSchema");

// THE HOME ROUTE
router.get("/", (req, res) => {
  res.send("this is router");
});

// USER REGISTRATION ROUTE
router.post("/register", async (req, res) => {
  // DESTRUCTURING THE BODYDATA
  const {
    name,
    email,
    usertype,
    password,
    cpassword,
    githubusername,
    dribbbleusername,
  } = req.body;

  // CHECK FOR THE DATA FIELDS
  if (!name || !email || !usertype || !password) {
    return res.status(402).json({ message: "please fill the data properly" });
  }

  try {
    //   CHECKING THAT THE USER ALREADY EXIST OR NOT
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(400).json({ message: "email already exist" });
    }
    // CHECK FOR BOTH PASSWORD FIELDS
    else if (password != cpassword) {
      return res.status(400).json({ message: "password does'nt match" });
    }
    // REGISTERING THE USERDATA TO THE DATABASE
    else {
      const user = new User({
        name,
        email,
        usertype,
        password,
        cpassword,
        githubusername,
        dribbbleusername,
      });
      // WILL GET EXECUTED AFTER THE PRE METHOD IN USERSCHEMA.JS
      const result = await user.save();
      res.status(201).json({ message: "user registered successfully" });
      console.log(result);
    }
  } catch (err) {
    // CATCH FOR ANY SERVER OR ANY OTHER ERROR
    res.status(500).send(err);
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  // DESTRUCTURING THE VARIABLES
  const { email, password } = req.body;

  // CHEKCING FOR THE DATAFIELDS
  if (!email || !password) {
    return res.status(400).json({ message: "fill the data properly" });
  }
  try {
    // GETTING THE DATA FORM DATABASE
    const usercheck = await User.findOne({ email: email });

    // CHECK FOR THE USER EXISTANCE
    if (usercheck) {

      // CHECKING FOR THE PASSWORD
      const isMatch = await bcrypt.compare(password, usercheck.password);

      // GENERATING AUTHORIZATION TOKEN
      let token = await usercheck.generateAuthToken();

      // CHECKING FOR USER CREDENTIALS
      if (usercheck && email == usercheck.email && isMatch) {
        return res.status(200).json({ message: "Login successfully" });
      } 
      else {
        // IF PASSWORD IS NOT SAME
        return res.status(500).json({ message: "invalid credentials" });
      }
    } 
    else {
      // IF THE USER IS NOT REGISTERED
      return res.status(400).json({ message: "user is not registred" });
    }

    // IN CASE OF INVALID USERID OR PASSWORD
  } catch (error) {
    //CATCH BLOCK
    return res.status(400).json({ message: err });
  }
});

module.exports = router;
