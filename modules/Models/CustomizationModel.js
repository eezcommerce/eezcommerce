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
		useThemeDefaults: {
			type: Boolean,
			default: true,
			required: true
		}
	})
);
