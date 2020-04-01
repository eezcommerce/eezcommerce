var mongoose = require("mongoose");

const OrdersModel = mongoose.model(
	"Orders",
	new mongoose.Schema({
		sellerId: {
			type: String,
			required: true
		},
		firstName: {
			type: String,
			maxlength: 128,
			required: true
		},
		lastName: {
			type: String,
			maxlength: 128,
			required: true
		},
		address: {
			lineOne: {
				maxlength: 256,
				type: String,
				required: true
			},
			lineTwo: {
				maxlength: 256,
				type: String
			},
			province: {
				type: String,
				maxlength: 2,
				required: true
			},
			country: {
				type: String,
				maxlength: 64,
				required: true,
				default: "Canada"
			},
			postalCode: {
				type: String,
				maxlength: 7,
				required: true
			}
		},
		email: {
			type: String,
			maxlength: 256,
			minlength: 4,
			required: true
		},
		status: {
			type: String,
			required: true,
			default: "Placed"
		},
		subTotal: {
			type: Number,
			multipleOf: 0.01,
			required: true
		},
		total: {
			type: Number,
			multipleOf: 0.01,
			required: true
		},
		productList: [{ ProductID: String, ProductName: String, Qty: Number }],
		created_at: {
			type: Date,
			required: true,
			default: Date.now()
		},
		updated_at: {
			type: Date,
			required: true,
			default: Date.now()
		},
		specInstr: {
			type: String,
			maxlength: 256
		}
	})
);

module.exports = OrdersModel;
