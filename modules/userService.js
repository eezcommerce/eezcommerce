var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var fs = require("fs");
const UserModel = require("./Models/UserModel");
const categoryService = require("./categoryService.js");
var customizationService = require("./customizationService.js");

async function doConnect() {
	await mongoose.connect("mongodb://localhost/eez", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	});
}

doConnect();

module.exports.SecurityQuestions = [
	{
		id: 0,
		question: "What is your first pet's name?"
	},
	{
		id: 1,
		question: "What is your Mother's Maiden name?"
	},
	{
		id: 2,
		question: "What city were you born in?"
	},
	{
		id: 3,
		question: "Where was your first date?"
	},
	{
		id: 4,
		question: "What street did you grow up on?"
	}
];

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
						try {
							fs.mkdirSync("public/siteData/" + result._id + "/img", { recursive: true });
						} catch (err) {
							reject("Error creating user directory. Please retry.");
						}

						customizationService
							.initialize(result._id)
							.then(obj => {
								//adding default category
								categoryService
									.addCategory(result._id, "General")
									.then(obj => {
										resolve(result);
									})
									.catch(err => {
										reject(err);
									});
							})
							.catch(err => {
								reject(err);
							});
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
			{
				businessName: passed.businessName,
				email: passed.email,
				$set: {
					securityAnswers: [
						{
							index: parseInt(passed.questionOne),
							answer: passed.answerOne
						},
						{
							index: parseInt(passed.questionTwo),
							answer: passed.answerTwo
						}
					]
				}
			},
			{
				runValidators: true
			},
			(err, result) => {
				if (err) {
					reject("Error saving: check input for requirements");
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
module.exports.getWebsiteDataById = id => {
	return new Promise((resolve, reject) => {
		UserModel.findById(id, "businessName", { lean: true }, (err, site) => {
			if (err) {
				reject(err);
			} else {
				resolve(site);
			}
		});
	});
};

/**
 * @returns {Object} a user object sanitized for session variable
 * @param {String} id a user id
 */

module.exports.getUserDataForSession = id => {
	return new Promise((resolve, reject) => {
		UserModel.findOne({ _id: id }, (err, user) => {
			if (err) {
				reject(err);
			} else {
				user.password = undefined;
				user.token = undefined;
				resolve(user);
			}
		});
	});
};
