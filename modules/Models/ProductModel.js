var mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
	owner: {
		type: String,
		required: true,
		unique: false
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
	},
	description: {
		type: String,
		default: "No description has been given to this product yet."
	},
	category: {
		type: String,
		default: "General"
	},
		img: { type: String, default: "" }
});

productSchema.index({ owner: 1, SKU: 1 }, { unique: true });

const ProductsModel = mongoose.model("Products", productSchema);
module.exports = ProductsModel;
