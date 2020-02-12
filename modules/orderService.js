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

const Orders = mongoose.model(
	"Orders",
	new mongoose.Schema({
		customerName: {
			type: String,
			maxlength: 256,
			minlength: 4,
			required: true,
			unique: true
		},
		password: {
			type: String,
			minlength: 8
		},
		token: {
			type: String,
			default: ""
		},
		isVerified: {
			type: Boolean,
			required: true,
			default: false
		},
		isActive: {
			type: Boolean,
			required: true,
			default: false
		}
	})
);
