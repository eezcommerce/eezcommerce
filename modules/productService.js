var mongoose = require("mongoose");
const Products = require("./Models/ProductModel");

async function doConnect() {
	await mongoose.connect("mongodb://localhost/eez", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	});
}

doConnect();

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
