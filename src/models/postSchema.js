const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
});

// CREATING A MODEL FOR THE SCHEMA
const Post = mongoose.model("POST", postSchema);

module.exports = Post;
