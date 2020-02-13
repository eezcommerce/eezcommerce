var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var ObjectId = require("mongodb").ObjectId;

async function doConnect() {
	await mongoose.connect("mongodb://localhost/eez", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	});
}

doConnect();

const Products = mongoose.model(
	"Products",
	new mongoose.Schema({
		SKU: {
			type: String,
			maxlength: 4,
			minlength: 4,
			required: true,
			unique: true
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

module.exports.addProduct = (prodName,qty,prodPrice) => {
	return new Promise((resolve, reject) => {
		var prod1 = new Products({ SKU: "0001", name: prodName, quantity: qty, price: prodPrice, purchased: 0 });

		prod1.save(function(err, product) {
			if (err) {
				reject(err);
			} else {
				resolve(product);
				console.log(product.name + " saved to products collection.");
			}
		});
	});
};
