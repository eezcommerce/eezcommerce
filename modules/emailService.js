/*
functions related to email verification & sending
*/

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const userService = require("./userService.js");

// creates a nodemailer transporter used to send email with transporter.sendMail() later
// this shouldn't need any further configuration if we're using the seneca email provided to us
var transporter = nodemailer.createTransport({
	host: "smtp.office365.com",
	port: 587, //MAKE SURE THIS PORT IS OPEN IN YOUR FIREWALL (Seneca blocks it)
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	},
	tls: {
		ciphers: "SSLv3",
		requireTLS: true
	}
});

/**
 * @param {String} email the user email
 * @param {String} mailType allowed: "signup", "reset"
 */
module.exports.sendVerificationEmail = (email, mailType) => {
	return new Promise((resolve, reject) => {
		// generate secure random bytes of data
		crypto.randomBytes(16, (err, res) => {
			// convert bytes to hex string for writing to a URL
			let token = res.toString("hex");

			try {
				userService.findMatchingEmail(email);
				userService.setToken(token, email);
			} catch (error) {
				reject(error);
			}
			// send email with secret link
			// set up email data

			var mailOptions;

			switch (mailType) {
				case "signup":
					mailOptions = {
						from: process.env.EMAIL_USER,
						to: email,
						subject: `eEz Commerce Email Verification`,
						html: `
					<div>
						<h1 style="color: #43ba9e">Thank you for registering with eEz Commerce!</h1>
	
						<p>Once confirmed you will be on your way to creating your own website to sell your products!</p>
					
						<p>Please click the link below to verify your email:</p>
						<a href="${process.env.SERVER_PUBLIC_URL}/verify_email/${email}/${token}">Verify Email Address</a>
					</div>
					`
					};
					break;

				case "reset":
					mailOptions = {
						from: process.env.EMAIL_USER,
						to: email,
						subject: `eEz Commerce Reset Account Password`,
						html: `
					<div>
						<h1 style="color: #43ba9e">Password Reset</h1>
						<p> You recently requested to reset your password for ${email} account.</p>
						<p>Please click the link below to reset your password. 
						<strong>This password reset is only valid for the next 24 hours.</strong></p>
						<a href="${process.env.SERVER_PUBLIC_URL}/reset_password/${email}/${token}">Reset Password</a>
					</div>
					`
					};
					break;
			}

			transporter.sendMail(mailOptions, function(err, info) {
				//callback function
				if (err) {
					reject(err);
				} else {
					resolve(email);
				}
			});
		});
	});
};

module.exports.sendReceipt = (email, order) => {
	return new Promise((resolve, reject) => {
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: `Receipt for Order #${order._id}`,
			html: `
					<div>
						<h1 style="color: #43ba9e">Thank you for your purchase with eEz Commerce!</h1>
					</div>

				<div>
					<table>
				<tr>
					<th>Item</th>
					<th>Qty.</th>
				</tr>

				<tr>
					<td>${order.ProductList[0].ProductName}</td>
					<td>${order.ProductList[0].Qty}</td>
				</tr>
					</table>
				</div>
					`
		};

		transporter.sendMail(mailOptions, function(err, info) {
			//callback function
			if (err) {
				reject(err);
			} else {
				resolve(info);
			}
		});
	});
};
