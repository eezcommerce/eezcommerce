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


const Orderlist = mongoose.model(
	Orderlist,
	new mongoose.Schema({
			SellerID: { type: String },
			OrderID: { type: String },
			ProductID: { type: String},
            Qty: {type: Number},
	})
);

module.exports.addOrder = (newSID, newOID, newPID, newQTY) => {
	return new Promise((resolve, reject) => {
		var Orderlst = new Orderlist({ SellerID: newSID, OrderID: newOID, ProductID: newPID, Qty: newQTY});
		Orderlst.save(function(err, Orderls) {
			if (err) {
				reject(err);
			} else {
				resolve(Orderls);
			}
		});
	});
};