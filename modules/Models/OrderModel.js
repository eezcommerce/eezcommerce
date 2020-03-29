var mongoose = require("mongoose");

const OrdersModel = mongoose.model(
	"Orders",
	new mongoose.Schema({
		SellerID: { type: String },
		CustName: { type: String },
		destAddress: { type: String },
		CustEmail: {
			type: String,
			maxlength: 256,
			minlength: 4,
			required: true,
			unique: true
		},
		status: { type: String },
		subtotal: { type: Number },
		total: { type: Number, 
			multipleOf: 0.01 },
		ProductList: [{ ProductID: String, ProductName: String, Qty: Number }],
		created_at: { type: Date, required: true, default: Date.now },
		updated_at: { type: Date, required: true, default: Date.now }
	})
);

module.exports = OrdersModel;
