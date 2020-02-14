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

function parseResponse(response) {
	var json = JSON.stringify(response);
	var parsed = JSON.parse(json);
	return parsed;
}

const Orders = mongoose.model(
	"Orders",
	new mongoose.Schema({
			SellerID: { type: String },
			destAddress: { type: String },
			CC: { type: Number},
			status: {type: String},
			total: { type: String },
	})
);

module.exports.getAllOrders = () => {
	return new Promise((resolve, reject) => {
		Orders.find({}, (err, ords) => {
			if (!err) {
				resolve(ords);
				console.log(ords);
			} else {
				console.log("error:" + err);
				reject(err);
			}
		});
	});
};


module.exports.addOrder = (newSID, newAdd, newCC, newStatus, newTotal) => {
	return new Promise((resolve, reject) => {
		var Order1 = new Orders({ SellerID: newSID, destAddress: newAdd, CC: newCC, status: newStatus, total: newTotal });
		console.log("Added " + Order1);
		Order1.save(function(err, Order) {
			if (err) {
				reject(err);
			} else {
				resolve(Order);
				console.log(Order.destAddress + " saved to orders collection.");
			}
		});
	});
};
