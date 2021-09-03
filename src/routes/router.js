const express = require("express");
const router = express.Router();
const User = require("./../models/userSchema");
router.get("/", (req, res) => {
  res.send("this is router");
});

router.post("/register", async (req, res) => {
  const {
    name,
    email,
    usertype,
    password,
    cpassword,
    githubusername,
    dribbbleusername,
  } = req.body;

  if (!name || !email || !usertype || !password) {
    return res.status(402).json({ message: "please fill the data properly" });
  }

  try {
    const userExists = await User.findOne({ email:email });
    if (userExists) {
      return res.status(400).json({ message: "email already exist" });
    } else if (password != cpassword) {
      return res.status(400).json({ message: "password does'nt match" });
    } else {
      const user = new User({
        name,
        email,
        usertype,
        password,
        cpassword,
        githubusername,
        dribbbleusername,
      });
      const result = await user.save();
      res.status(201).json({ message: "user registered successfully" });
      console.log(result);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
