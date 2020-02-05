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

var db = doConnect();

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
		isActive: {
			type: Boolean,
			required: true,
			default: false
		},
		token: {
			type: String,
			default: ""
		},
		isVerified: {
			type: Boolean,
			required: true,
			default: false
		}
	})
);

/**
 * @param {object} passed email & password
 */
module.exports.create = (passed = { email: "email", password: "password" }) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(passed.password, salt, (err, hash) => {
				var userObj = new UserModel({
					email: passed.email,
					password: hash
				});

				userObj
					.save()
					.then(result => {
						resolve(result);
					})
					.catch(err => {
						reject(err);
					});
			});
		});
	});
};

/**
 * @param {String} email the user email (unique)
 * @param {String} password a plaintext password to be checked
 * @returns {Promise} promise resolving with sanitized user or rejecting with error
 */
(module.exports.authenticate = (email, password) => {
	return new Promise((resolve, reject) => {
		UserModel.findOne({ email: email }, (err, user) => {
			if (!err && user) {
				bcrypt.compare(password, user.password, (err, result) => {
					if (!err && result) {
						user.password = undefined;
						resolve(user);
					} else {
						reject(err || { error: "no match" });
					}
				});
			} else {
				reject(err || { error: "no match" });
			}
		});
	});
}),
	/**
	 * @param {String} inputEmail the user email to be checked against the database
	 * @returns {Promise} promise resolving with sanitized user or rejecting with error
	 */
	(module.exports.findMatchingEmail = inputEmail => {
		return new Promise((resolve, reject) => {
			UserModel.findOne({ email: inputEmail }, (err, user) => {
				if (!err && user) {
					console.log("user:" + user);
					resolve(true);
				} else {
					reject(err || { error: "no match" });
				}
			});
		});
	});

/**
 * @param {String} token random value stored to be verified via email
 * @param {String} inputEmail email used as identifier to update token value.
 * */

module.exports.setToken = (token, inputEmail) => {
	return new Promise(function(resolve, reject) {
		try {
			UserModel.updateOne({ email: inputEmail }, { token: token }, function(err, res) {
				if (res.modifiedCount == 1) {
					console.log("here?");
					resolve(res);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};
