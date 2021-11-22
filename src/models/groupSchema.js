const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
	{
		groupId: {
			type: String,
			required: true,
			unique: true,
		},
		groupName: {
			type: String,
			required: true,
		},
		members: {
			type: Array,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
