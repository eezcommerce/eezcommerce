var mongoose = require("mongoose");

const UserModel = mongoose.model(
	"user",
	new mongoose.Schema({
		email: {
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
		},
		businessName: {
			type: String,
			minlength: 2,
			maxlength: 64,
			required: true,
			default: "eEz Commerce Business"
		},
		industry_id: {
			type: String
		},
		didCompleteWizard: {
			type: Boolean,
			default: false
		},
		securityAnswers: [
			{
				index: {
					type: Number,
					default: 0
				},
				answer: {
					type: String,
					default: "answer",
					maxlength: 64,
					minlength: 2
				}
			}
		],
		membershipType: {
			type: String,
			enum: ["Basic", "Premium"],
			default: "Basic"
		},
		tokenExpiry: {
			type: Number,
			default: Date.now() + 1000 * 60 * 60 * 24
		},
		aboutBlurb: {
			type: String,
			default: " ",
			maxlength: 512,
			required: true
		}
	})
);

module.exports = UserModel;
