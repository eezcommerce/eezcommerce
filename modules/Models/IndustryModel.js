var mongoose = require("mongoose");

const IndustryModel = mongoose.model(
	"Industries",
	new mongoose.Schema({
		name: {
			type: String,
			maxlength: 128,
			required: true,
			unique: true
		}
	})
);
IndustryModel.insertMany(
	[
		{ name: "Automotive" },
		{ name: "Kitchen" },
		{ name: "Tools" },
		{ name: "Hardware" },
		{ name: "Home Decor" },
		{ name: "Home Improvement" },
		{ name: "Art" },
		{ name: "Art Supplies" },
		{ name: "Crafts" },
		{ name: "Hobbies and Collectibles" },
		{ name: "Other" }
	],
	(err, res) => {
		if (err) {
			console.log("Industries already setup");
		}
	}
);

module.exports = IndustryModel;
