const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("./../models/userSchema");
const authenticate = require("../middleware/authenticate");

// USER REGISTRATION ROUTE
router.post("/register", async (req, res) => {
	// DESTRUCTURING THE BODYDATA
	const { name, email, usertype, password, githubusername, dribbbleusername } =
		req.body;

	// CHECK FOR THE DATA FIELDS
	if (!name || !email || !usertype || !password) {
		return res.status(422).json({ message: "please fill the data properly" });
	}

	try {
		//   CHECKING THAT THE USER ALREADY EXIST OR NOT
		const userExists = await User.findOne({ email: email });

		if (userExists) {
			return res.status(422).json({ message: "email already exist" });
		}

		// REGISTERING THE USERDATA TO THE DATABASE
		else {
			const user = new User({
				name,
				email,
				usertype,
				password,
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
			const token = await usercheck.generateAuthToken();

			console.log("token in login : ", token);

			// CHECKING FOR USER CREDENTIALS
			if (usercheck && email == usercheck.email && isMatch) {
				// SENDING THE ACCESSTOKEN TO FRONTEND WITH RESPONSE DATA
				return res
					.status(200)
					.json({ message: "Login successfully", accessToken: token });
			} else {
				// IF PASSWORD IS NOT SAME
				return res.status(400).json({ message: "invalid credentials" });
			}
		} else {
			// IF THE USER IS NOT REGISTERED
			return res.status(400).json({ message: "user is not registred" });
		}

		// IN CASE OF INVALID USERID OR PASSWORD
	} catch (error) {
		//CATCH BLOCK
		return res.status(400).json({ message: error });
	}
});

// HOME DASHBOARD PAGE
router.get("/dashboard", authenticate, (req, res) => {
	res.send(req.rootUser);
	console.log("this is rootuser dashboard");
});

module.exports = router;
