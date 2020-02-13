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
			minlength: 1,
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
function parseResponse(response) {
	var json = JSON.stringify(response);
	var parsed = JSON.parse(json);
	return parsed;
}

module.exports.getAllProducts = () => {
	return new Promise((resolve, reject) => {
		Products.find({}, (err, prods) => {
			var parsedProds = parseResponse(prods);
			if (!err) {
				resolve(parsedProds);
			} else {
				console.log("error:" + err);
				reject(err);
			}
		});
	});
};

module.exports.addProduct = (prodSku, prodName, prodQty, prodPrice) => {
	return new Promise((resolve, reject) => {
		var prod1 = new Products({ SKU: prodSku, name: prodName, quantity: prodQty, price: prodPrice, purchased: 0 });

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
