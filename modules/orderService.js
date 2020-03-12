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

module.exports.addOrder = (newSID, newAdd, newCC, newStatus, newTotal, newPList) => {
	return new Promise((resolve, reject) => {
		var Order1 = new Orders({
			SellerID: newSID,
			destAddress: newAdd,
			CC: newCC,
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

module.exports.addOrder = (newSID, newAdd, newCC, newStatus, newTotal) => {
	return new Promise((resolve, reject) => {
		var Order1 = new Orders({
			SellerID: newSID,
			destAddress: newAdd,
			CC: newCC,
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
 * @function getOrdersWithSort gets orders for a specified site with a sort object being passed
 * @returns {Array} array of orders
 * @param {String} id ID of site to lookup orders for
 * @param {Object} sort sort object in mongoose format ie: {date: -1}
 */

module.exports.getOrdersWithSort = (id, sort = { date: -1 }) => {
	return new Promise((resolve, reject) => {
		Orders.find({ SellerID: id }, null, { sort: sort }, (err, result) => {
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

module.exports.UpdateOrder = (OrdId, newStatus) => {
	return new Promise((resolve, reject) => {
		Products.updateOne({ _id: OrdId }, { status: newStatus }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
