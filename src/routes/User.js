const bcrypt = require("bcryptjs");
const express = require("express");
const router = require("express").Router();
const User = require("./../models/userSchema");
const Post = require("../models/postSchema");
const authenticate = require("../middleware/authenticate");

// update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("account has been updated");
    } catch (error) {
      res.status(500).json({ error: "not updated" });
    }
  } else {
    return res
      .status(403)
      .json({ message: "you can update only your account" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findByIdAndDelete({ _id: req.params.id });
      if (user === null) {
        return res.status(400).json({ message: "user not found" });
      } else {
        return res.status(200).json({ message: "account has been deleted" });
      }
    } catch (error) {
      res.status(500).json({ error: "not deleted" });
    }
  } else {
    return res
      .status(403)
      .json({ message: "you can delete only your account" });
  }
});

// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    const { password, createdAt, updatedAt, tokens, ...others } = user._doc;
    if (user === null) {
      return res.status(400).json({ message: "user not found" });
    } else {
      return res.status(200).json({ message: "user found", data: others });
    }
  } catch (error) {
    res.status(500).json({ error: "not found" });
  }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.body.userId);
      const user = await User.findById(req.params.id);
      if (!user.followers.includes(currentUser.id)) {
        await user.updateOne({ $push: { followers: [currentUser.id] } });
        await currentUser.updateOne({ $push: { following: [user.id] } });
        res.status(200).json({ message: "you have followed this user" });
      } else {
        res.status(400).json({ message: "you already follow this user" });
      }
    } catch (err) {
      res.status(400).json({ message: "user does not exist" });
    }
  } else {
    return res.status(400).json({ message: "you cant follow yourself" });
  }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({ message: "user has been unfollowed" });
      } else {
        res.status(403).json({ message: "you dont follow this user" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

// get all post except the current user
router.get("/:id/alluser", async (req, res) => {
  const userId = req.params.id;

  try {
    const userCheck = await User.findById(userId);
    if (!userCheck) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const allUsers = await User.find({ _id: { $ne: userId } }).select({
      name: 1,
      usertype: 1,
      githubusername: 1,
      dribbbleusername: 1,
      address: 1,
      profileurl: 1,
      profileimage: 1,
      followers: 1,
      following: 1,
      description: 1,
    });
    if (allUsers.length < 0) {
      return res.status(200).json({ msg: "no users found" });
    } else {
      return res.status(200).json({ data: allUsers });
    }
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
});

// send collab req notification
router.put("/:id/notification", async (req, res) => {
  try {
    // jisko notification jaega
    // userid =  post creator
    // currentuser =  request sender
    const userId = req.params.id;
    const postId = req.body.postId;
    const currentUser = req.body.currentUserId;
    const userCheck = await User.findById(userId);
    if (!userCheck) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ msg: "Post does not exist" });
    }
    const result = await userCheck.updateOne({
      $push: {
        notifications: {
          userId: currentUser,
          postId: postId,
          notifType: "collabreq",
        },
      },
    });
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
});

// accept collab req notification
router.put("/:id/acceptnotification", async (req, res) => {
  try {
    // postid & current user  === accept karne vale ka hai
    // userid === requestor ka hai
    const userId = req.params.id;
    const postId = req.body.postId;
    const currentUser = req.body.currentUserId;
    const userCheck = await User.findById(userId);
    if (!userCheck) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ msg: "Post does not exist" });
    }
    const result = await userCheck.updateOne({
      $push: {
        notifications: {
          userId: currentUser,
          postId: postId,
          notifType: "acceptreq",
        },
      },
    });

    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
});

// delete collab req notification
router.put("/:id/deleteNotification", async (req, res) => {
  try {
    const acceptorUserId = req.body.acceptorUserId;
    const notifId = req.params.id;
    const result = await User.findOneAndUpdate(
      { _id: acceptorUserId },
      { $pull: { notifications: { _id: notifId } } },
      { safe: true, multi: false }
    );

    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
