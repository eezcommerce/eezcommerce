const CustomizationModel = require("./Models/CustomizationModel");

/**
 * @param {String} id the user id for the website to initialize
 */
module.exports.initialize = id => {
	return new Promise((resolve, reject) => {
		let cust = new CustomizationModel({
			owner: id,
			primaryColor: "#0022ff",
			secondaryColor: "#efeff"
		});

		cust.save((err, obj) => {
			if (err) {
				reject(err);
			} else {
				resolve(obj);
			}
		});
	});
};

/**
 * @param {String} id the user id for the website to update
 * @param {Object} customization customization object to update
 */
module.exports.edit = (id, customization) => {
	return new Promise((resolve, reject) => {
		CustomizationModel.updateOne({ owner: id }, customization, (err, resp) => {
			if (err) {
				reject(err);
			} else {
				resolve(resp);
			}
		});
	});
};

/**
 * @param {String} id the user id for the website to update
 */
module.exports.get = id => {
	return new Promise((resolve, reject) => {
		CustomizationModel.findOne({ owner: id }, {}, { lean: true }, (err, resp) => {
			if (err) {
				reject(err);
			} else {
				resolve(resp);
			}
		});
	});
};
