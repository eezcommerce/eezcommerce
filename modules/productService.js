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

module.exports.getAllProducts = ownerId => {
	return new Promise((resolve, reject) => {
		Products.find({ owner: ownerId }, (err, prods) => {
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

module.exports.productsWithCategory = (ownerId, category) => {
	return new Promise((resolve, reject) => {
		Products.countDocuments({ owner: ownerId, category: category }, (err, count) => {
			if (!err) {
				resolve(count);
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
module.exports.addProduct = (ownerId, prodSku, prodName, prodQty, prodPrice, prodDesc, prodCat) => {
	return new Promise((resolve, reject) => {
		var prod1 = new Products({
			owner: ownerId,
			SKU: prodSku,
			name: prodName,
			quantity: prodQty,
			price: prodPrice,
			purchased: 0,
			description: prodDesc,
			category: prodCat
		});

		prod1.save(function(err, product) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve(product);
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

module.exports.isDuplicate = (ownerId, testValue) => {
	return new Promise((resolve, reject) => {
		this.getAllProducts(ownerId)
			.then(prods => {
				prods.forEach(prod => {
					if (prod.SKU == testValue) {
						resolve("true");
					}
				});
				resolve("false");
			})
			.catch(err => {
				resolve(err);
			});
	});
};
