var mongoose = require("mongoose");

module.exports = mongoose.model(
	"Customization",
	new mongoose.Schema({
		owner: String,
		primaryColor: String,
		secondaryColor: String
	})
);
