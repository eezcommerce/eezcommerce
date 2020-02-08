var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var ObjectId = require("mongodb").ObjectId;

const businessUserModel = mongoose.model(
	"businessUser",
	new mongoose.Schema({
		organizationName: {
			type: String,
			maxlength: 256,
			minlength: 3,
			required: true,
			unique: true
		},
		location: {
			type: String,
			minlength: 3
		},
		businessType: {
			type: String,
			default: ""
		},
		plan: {
			type: String,
			default: ""
		}
	})
);

// info for owner to receive payment
const ownerModel = mongoose.model(
	"owner",
	new mongoose.Schema({
		ownerName: {
			type: String,
			maxlength: 256,
			minlength: 3,
			required: true
		},
		ownerAddress: {
			type: String,
			maxlength: 256,
			minlength: 3,
			required: true
		},
		apt_suite: {
			type: String,
			maxlength: 4
		},
		city: {
			type: String,
			minlength: 3,
			maxlength: 85,
			required: true
		},
		postalcode_zip: {
			type: String,
			minlength: 5,
			maxlength: 11,
			required: true
		},
		country: {
			type: String,
			minlength: 2,
			maxlength: 85,
			required: true
		},
		province: {
			type: String,
			minlength: 2,
			maxlength: 85,
			required: true
		},
		phoneNumber: {
			type: String,
			minlength: 8,
			maxlength: 20
		}
	})
);
