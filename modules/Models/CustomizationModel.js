var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

module.exports = mongoose.model(
	"Customization",
	new mongoose.Schema({
		owner: String,
		primaryColor: String,
		secondaryColor: String,
		darkColor: String,
		lightColor: String,
		themeId: {
			type: String,
			default: "default"
		},
		showAbout: {
			type: Boolean,
			default: false,
			required: true
		},
		useThemeFont: {
			type: Boolean,
			default: true,
			required: true
		},
		useThemeColour: {
			type: Boolean,
			default: true,
			required: true
		}
	})
);
