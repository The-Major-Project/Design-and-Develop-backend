const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderPhoto: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
    unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
