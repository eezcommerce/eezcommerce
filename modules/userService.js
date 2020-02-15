var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

async function doConnect() {
	await mongoose.connect("mongodb://localhost/eez", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	});
}

doConnect();

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
		primaryColor: {
			type: String,
			default: "#000000"
		},
		secondaryColor: {
			type: String,
			default: "#000000"
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
 * @param {String} email the email to delete
 */
module.exports.delete = email => {
	return new Promise((resolve, reject) => {
		UserModel.deleteOne({ email: email }, (err, deleteResult) => {
			if (err) {
				reject(err);
			} else {
				resolve(deleteResult);
			}
		});
	});
};

/**
 * @param {String} email the user email (unique)
 * @param {String} password a plaintext password to be checked
 * @returns {Promise} promise resolving with sanitized user or rejecting with error
 */
module.exports.authenticate = (email, password) => {
	return new Promise((resolve, reject) => {
		UserModel.findOne({ email: email }, (err, user) => {
			if (!err && user) {
				bcrypt.compare(password, user.password, (err, result) => {
					if (!err && result) {
						user.password = undefined;
						user.token = undefined;
						resolve(user);
					} else {
						reject(err || "Username or password incorrect.");
					}
				});
			} else {
				reject(err || "Username or password incorrect.");
			}
		});
	});
};

module.exports.getAllEmails = () => {
	return new Promise((resolve, reject) => {
		UserModel.find({}, function(err, users) {
			if (!err) {
				var arrayEmails = new Array();
				users.forEach(user => {
					arrayEmails.push(user.email);
				});
				resolve(arrayEmails);
			} else {
				reject(err || { error: "Could not retrieve emails from database." });
			}
		});
	});
};

/**
 * @param {String} inputEmail the user email to be checked against the database
 * @returns {Promise} promise resolving with sanitized user or rejecting with error
 */
module.exports.findMatchingEmail = inputEmail => {
	return new Promise((resolve, reject) => {
		UserModel.findOne({ email: inputEmail }, (err, user) => {
			if (!err) {
				resolve(user);
			} else {
				reject(err || { error: "Email does not exist in database." });
			}
		});
	});
};

/**
 * @param {String} token random value stored to be verified via email
 * @param {String} inputEmail email used as identifier to update token value.
 * */

module.exports.setToken = (token, inputEmail) => {
	return new Promise(function(resolve, reject) {
		try {
			UserModel.updateOne({ email: inputEmail }, { token: token }, function(err, res) {
				if (res.modifiedCount == 1) {
					resolve(res);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * @returns {Object} updated user
 * @param {Object} updated user object
 */
module.exports.edit = passed => {
	return new Promise((resolve, reject) => {
		UserModel.updateOne(
			{ _id: passed._id },
			{ businessName: passed.businessName, email: passed.email },
			(err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			}
		);
	});
};

/**
 * @returns {Object} updated user
 * @param {Object} updated user object
 */
module.exports.customize = passed => {
	return new Promise((resolve, reject) => {
		UserModel.updateOne(
			{ _id: passed._id },
			{ primaryColor: passed.primaryColor, secondaryColor: passed.secondaryColor },
			(err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			}
		);
	});
};

/**
 * @returns {Object} a user object
 * @param {String} token token to validate
 * @param {String} inputEmail email to validate
 */

module.exports.validateToken = (token, inputEmail) => {
	return new Promise(function(resolve, reject) {
		UserModel.findOne({ email: inputEmail }, function(err, user) {
			if (err) {
				reject({ error: "Matching email not found." });
			} else {
				if (user.token == token) {
					UserModel.updateOne({ email: inputEmail }, { isVerified: true }, (err, user) => {
						if (err) {
							reject({ error: err });
						} else {
							resolve(user);
						}
					});
				} else {
					reject({ error: "Token not valid." });
				}
			}
		});
	});
};

/**
 * @returns {Object} data pertaining to the rendering of a site
 * @param {String} id 
 */
module.exports.getWebsiteDataById = (id)=>{
	return new Promise((resolve, reject)=>{
		UserModel.findById(id, "businessName primaryColor secondaryColor", {lean: true}, (err, site)=>{
			if (err){
				reject(err);
			} else{
				resolve(site);
			}
		})
	})
}