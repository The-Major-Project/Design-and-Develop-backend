const router = require("express").Router();
const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const Message = require("../models/messageSchema");
const Group = require("../models/groupSchema");
const mongoose = require("mongoose");

// create group
router.post("/group", async (req, res) => {
  const newGroup = new Group(req.body);
  try {
    const savedGroup = await newGroup.save();
    res.status(200).json({ msg: "Group created successfully" });
  } catch (error) {
    res.status(500).json("error");
  }
});

//   get groups of a user
router.get("/group", async (req, res) => {
  try {
    const userId = req.body.userId;
    const resultGroup = await Group.find({ members: { $in: [userId] } });
    res.send(resultGroup);
  } catch (error) {
    res.status(500).json("error");
  }
});

// add memeber to groups
router.put("/addtogroup", async (req, res) => {
  const memberId = req.body.id;
  const groupId = req.body.groupId;

  try {
    const groupData = await Group.findOne({ groupId: groupId });
    if (!groupData.members.includes(memberId)) {
      await groupData.updateOne({ $push: { members: [memberId] } });
      res.status(200).json("User Added");
    } else {
      res.status(400).json("already added");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// ***********************MESSAGE APIS*************************//

// create a message
router.post("/message", async (req, res) => {
  const { message, senderName, senderPhoto, groupId } = req.body;
  try {
    const newMessage = new Message({
      message,
      senderName,
      senderPhoto,
      groupId,
    });

    newMessage.save(function (err, newMessage) {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({ msg: newMessage });
      }
    });
  } catch (error) {
    res.status(500).json("error");
  }
});

//   get all message of a groupId

router.get("/message", async (req, res) => {
  const groupId = req.body.groupId;

  try {
    const allMessages = await Message.find({ groupId: groupId });
    if (allMessages.length) {
      res.status(200).json(allMessages);
    } else {
      res.status(200).json({ msg: "no messages to show" });
    }
  } catch (error) {
    res.status(500).json("error");
  }
});

module.exports = router;
