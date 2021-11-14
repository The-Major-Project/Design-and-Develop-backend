const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    max: 100,
  },
  description: {
    type: String,
    max: 500,
  },
  developer:{
	type: Number,
    min: 0,
	required: true,
  },
  designer:{
	type: Number,
    min: 0,
	required: true,
  },
  img: {
    type: String,
  },
  likes:{
      type: Array,
      default:[]
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
