const express = require("express");
const router = express.Router();
const Post = require("./../models/postSchema");
const authenticate = require("../middleware/authenticate");

// Post route
router.post("/posts", authenticate, async (req, res) => {
	const { name, email } = req.body;
	if (!name || !email) {
		return res.status(422).json({ message: "please fill the data properly" });
	}
	try {
		const post = new Post({
			name,
			email,
		});
		const result = await post.save();
		res.status(201).json({ message: "Job posted successfully" });
		console.log(result);
	} catch (err) {
		res.status(500).send(err);
	}
});

// Get all posts except yours route
router.get("/posts", authenticate, async (req, res) => {});

// Get your posts route
router.get("/my-posts", authenticate, async (req, res) => {});

// Edit a post route
router.put("/posts/:id", authenticate, async (req, res) => {});

// Delete a post route
router.delete("/posts/:id", authenticate, async (req, res) => {});

module.exports = router;
