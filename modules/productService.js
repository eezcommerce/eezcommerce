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
			type: Number,
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

module.exports.addProduct = () => {
	return new Promise((resolve, reject) => {
		console.log("declaring product");
		var prod1 = new Products({ SKU: 0001, name: "Cookies", quantity: 3, price: 5, purchased: 10 });
		console.log("hello?");
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
