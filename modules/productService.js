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

module.exports.getProductById = id => {
	return new Promise((resolve, reject) => {
		Products.findOne({ _id: id }, (err, prod) => {
			var parsedProd = parseResponse(prod);
			if (!err) {
				resolve(parsedProd);
			} else {
				console.log("error:" + err);
				reject(err);
			}
		});
	});
};
module.exports.addProduct = (prodSku, prodName, prodQty, prodPrice, prodDesc) => {
	return new Promise((resolve, reject) => {
		var prod1 = new Products({
			SKU: prodSku,
			name: prodName,
			quantity: prodQty,
			price: prodPrice,
			purchased: 0,
			description: prodDesc
		});

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
/**
 * @param {String} id the id to delete
 */
module.exports.deleteProduct = id => {
	return new Promise((resolve, reject) => {
		Products.deleteOne({ _id: id }, (err, deleteResult) => {
			if (err) {
				reject(err);
			} else {
				resolve(deleteResult);
			}
		});
	});
};

/**
 * @returns {Object} updated product
 * @param {Object} updated product object
 */
module.exports.editProduct = passed => {
	return new Promise((resolve, reject) => {
		Products.updateOne({ _id: passed._id }, { name: passed.name, price: passed.price }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
