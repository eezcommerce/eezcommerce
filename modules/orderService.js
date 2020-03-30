var mongoose = require("mongoose");
const Orders = require("./Models/OrderModel");
const mailService = require("./emailService.js");

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

module.exports.getAllOrders = sID => {
	return new Promise((resolve, reject) => {
		Orders.find({ sellerId: sID }, (err, ords) => {
			var parsedProds = parseResponse(ords);
			if (!err) {
				resolve(parsedProds);
			} else {
				console.log("error:" + err);
				reject(err);
			}
		});
	});
};

module.exports.getOrderById = oneId => {
	return new Promise((resolve, reject) => {
		Orders.findOne({ _id: oneId }, (err, ords) => {
			if (!err) {
				resolve(ords);
			} else {
				console.log("error:" + err);
				reject(err);
			}
		});
	});
};

/**
 * @function addOrder creates an order
 * @param {Object} input an input object from req.body
 */
module.exports.addOrder = input => {
	var {
		firstName,
		lastName,
		email,
		address1,
		address2,
		country,
		province,
		postalCode,
		productList,
		sellerId,
		subTotal,
		total,
		province
	} = input;

	return new Promise((resolve, reject) => {
		var Order1 = new Orders({
			sellerId: sellerId,
			firstName: firstName,
			lastName: lastName,
			address: {
				lineOne: address1,
				lineTwo: address2,
				country: country,
				postalCode: postalCode,
				province: province
			},
			email: email,
			status: "Placed",
			subTotal: subTotal,
			total: total,
			productList: productList
		});
		Order1.save(function(err, Order) {
			if (err) {
				reject(err);
			} else {
				resolve(Order);
			}
		});
	});
};

/**
 * @function getOrdersWithSort gets orders for a specified site with a sort object being passed
 * @returns {Array} array of orders
 * @param {String} id ID of site to lookup orders for
 * @param {Object} sort sort object in mongoose format ie: {date: -1}
 */

module.exports.getOrdersWithSort = (id, sort = { created_at: -1 }) => {
	return new Promise((resolve, reject) => {
		Orders.find({ sellerId: id }, null, { sort: sort, limit: 5 }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		}).lean();
	});
};

/**
 * @returns {Object}
 * @param {Object} updated
 */

module.exports.editOrder = (OrdId, newStatus, cusEmail) => {
	return new Promise((resolve, reject) => {
		Orders.updateOne({ _id: OrdId }, { status: newStatus, updated_at: Date.now() }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
				//send email to customer on file to show changes to the order
				//mailService.sendUpdate(result);
			}
		});
	});
};
