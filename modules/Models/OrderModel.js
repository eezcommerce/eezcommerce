var mongoose = require("mongoose");

const OrdersModel = mongoose.model(
	"Orders",
	new mongoose.Schema({
		SellerID: { type: String },
		destAddress: { type: String },
		CC: { type: Number },
		status: { type: String },
		total: { type: String },
		ProductList: [{ ProductID: String, Qty: Number }]
	})
);

module.exports = OrdersModel;
