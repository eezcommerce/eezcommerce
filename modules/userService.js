var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

//EnsureIndex deprecation replaced by with useCreateIndex
mongoose.set('useCreateIndex',true);

async function doConnect() {
	await mongoose.connect("mongodb://localhost/eez", {
		useNewUrlParser: true,
		useUnifiedTopology: true
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
		isActive: {
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
module.exports.authenticate = (email, password) => {
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
};
