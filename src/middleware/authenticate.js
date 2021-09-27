const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const authenticate = async (req, res, next) => {
  try {
    //   GETTING ACCESS TOKEN FROM FRONTEND
    const token = req.header("accessToken");

    // TOKEN VERIFICATION
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("user not found");
    }

    // SETTING TOKEN / USER VALUES
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    console.log("user found");
    next();
  } catch (err) {
    res.status(401).send("unauthorized");
    console.log("unauthorized: no token provided");
    console.log(err);
  }
};

module.exports = authenticate;
