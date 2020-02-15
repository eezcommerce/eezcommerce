var mongoose = require("mongoose");
Schema = mongoose.Schema;

const ProductsModel = mongoose.model(
	"Products",
	new mongoose.Schema({
		owner: {
			type: Schema.ObjectId,
			ref: "UserModel",
			required: true
		},

		SKU: {
			type: String,
			maxlength: 4,
			minlength: 1,
			required: true
		},
		name: {
			type: String,
			minlength: 2
		},
		quantity: {
			type: Number,
			default: 0
		},
		price: {
			type: Number,
			required: true,
			default: false
		},
		purchased: {
			type: Number,
			required: true,
			default: 0
		}
	})
);
module.exports = ProductsModel;
