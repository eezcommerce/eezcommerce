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

module.exports = IndustryModel;
