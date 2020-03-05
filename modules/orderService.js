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
//Read
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
//create
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
//create basic
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
//Update
//only thing that should be able to change is status. Price, products and address should verified before order was created
module.exports.updateOrder = (oID, newStatus) => {
	return new Promise((resolve, reject) => {
		console.log("update Order");
		Products.updateOne({ _id: oID }, { status: newStatus }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
