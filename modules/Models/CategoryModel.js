var mongoose = require("mongoose");
Schema = mongoose.Schema;

const CategoryModel = mongoose.model(
	"Categories",
	new mongoose.Schema({
		owner: {
			type: String,
			required: true,
			unique: false
		},
		name: {
			type: String,
			minlength: 2
		}
	})
);
module.exports = CategoryModel;
