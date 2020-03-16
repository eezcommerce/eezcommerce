var mongoose = require("mongoose");
const Orders = require("./Models/OrderModel");

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
		Orders.find({ SellerID: sID }, (err, ords) => {
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

module.exports.addOrder = (newSID, newAdd, newStatus, newTotal, newPList) => {
	return new Promise((resolve, reject) => {
		var Order1 = new Orders({
			SellerID: newSID,
			destAddress: newAdd,
			status: newStatus,
			total: newTotal,
			ProductList: newPList
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

module.exports.addOrder = (newSID, newAdd, newStatus, newTotal) => {
	return new Promise((resolve, reject) => {
		var Order1 = new Orders({
			SellerID: newSID,
			destAddress: newAdd,
			status: newStatus,
			total: newTotal,
			ProductList: []
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
 * @returns {Object}
 * @param {Object} updated
 */

module.exports.editOrder = (OrdId, newStatus) => {
	console.log("edit order");
	return new Promise((resolve, reject) => {
		Orders.updateOne({ _id: OrdId }, { status: newStatus, updated_at: Date.now }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				console.log(result);
				resolve(result);
			}
		});
	});
};
