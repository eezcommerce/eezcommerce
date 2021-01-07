var mongoose = require("mongoose");
const Categories = require("./Models/CategoryModel");

async function doConnect() {
	await mongoose.connect(process.env.MONGO_SERVER, {
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

module.exports.getAllCategories = ownerId => {
	return new Promise((resolve, reject) => {
		Categories.find({ owner: ownerId }, (err, categories) => {
			var parsedCategories = parseResponse(categories);
			if (!err) {
				resolve(parsedCategories);
			} else {
				console.log("error:" + err);
				reject(err);
			}
		});
	});
};

module.exports.getCategoryById = id => {
	return new Promise((resolve, reject) => {
		Categories.findOne({ _id: id }, (err, category) => {
			var parsedCategory = parseResponse(category);
			if (!err) {
				resolve(parsedCategory);
			} else {
				console.log("error:" + err);
				reject(err);
			}
		});
	});
};
module.exports.addCategory = (ownerId, categoryName) => {
	return new Promise((resolve, reject) => {
		Categories.find({ owner: ownerId, name: categoryName }, function(err, docs) {
			if (docs.length) {
				reject("Name already exists!");
			} else {
				var cat = new Categories({
					owner: ownerId,
					name: categoryName
				});

				cat.save(function(err, category) {
					if (err) {
						console.log(err);
						reject(err);
					} else {
						resolve(category);
					}
				});
			}
		});
	});
};
/**
 * @param {String} id the id to delete
 */
module.exports.deleteCategory = id => {
	return new Promise((resolve, reject) => {
		Categories.deleteOne({ _id: id }, (err, deleteResult) => {
			if (err) {
				reject(err);
			} else {
				resolve(deleteResult);
			}
		});
	});
};

/**
 * @returns {Object} updated category
 * @param {Object} updated category object
 */
module.exports.editCategory = passed => {
	return new Promise((resolve, reject) => {
		Categories.updateOne({ _id: passed._id }, { name: passed.name, price: passed.price }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
