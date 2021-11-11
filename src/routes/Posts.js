const router = require("express").Router();
const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");


// create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({ msg:"posted successfully" });
  } catch (error) {
    res.status(500).json("error");
  }
});

// update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await Post.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like a post
router.put("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);
  const currentUser = req.body.userId;
  try {
    if (mongoose.Types.ObjectId.isValid(currentUser)) {
      if (!post.likes.includes(currentUser)) {
        await post.updateOne({ $push: { likes: [currentUser] } });
        res.status(200).json("post liked");
      } else if (post.likes.includes(currentUser)) {
        await post.updateOne({ $pull: { likes: currentUser } });
        res.status(200).json("post unliked");
      }
    } else {
      res.status(404).json("invalid user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    console.log(post);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all posts of a user
router.get('/:id/all', async(req, res) => {
  const userId = req.params.id

  try {
	const userCheck = await User.findById(userId)
	if (!userCheck){
		return res.status(400).json({msg: 'User does not exist'})
	}
    const allPosts = await Post.find({userId:userId})
    if(allPosts.length < 0) {
      return res.status(200).json({msg:"no posts found"})
    }
    else{
      return res.status(200).json({data:allPosts})
    }
  } catch (error) {
    res.status(500).json({msg: "server error"})
  }
})


module.exports = router;
