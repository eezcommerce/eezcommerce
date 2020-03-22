var mongoose = require("mongoose");

const OrdersModel = mongoose.model(
	"Orders",
	new mongoose.Schema({
		SellerID: { type: String },
		CustName: { type: String },
		destAddress: { type: String },
		status: { type: String },
		total: { type: String },
		ProductList: [{ ProductID: String, ProductName: String, Qty: Number }],
		created_at: { type: Date, required: true, default: Date.now },
		updated_at: { type: Date, required: true, default: Date.now }
	})
);

module.exports = OrdersModel;
