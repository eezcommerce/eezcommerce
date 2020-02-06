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

// sends a verification email to the provided email containing a secret, random token
// TODO: store the token in the user in the database
// Returns a promise, resolving with an error or the email provided
module.exports.sendVerificationEmail = email => {
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
			transporter.sendMail(
				{
					from: process.env.EMAIL_USER,
					to: email,
					subject: `eEz Commerce Email Verification`,
					html: `
				<div>
					<h1 style="color: #43ba9e">Thank you for registering with eEz Commerce!</h1>

					<p>Once confirmed you will be on your way to creating your own website to sell your products!
				
					<p>Please click the link below to verify your email:</p>
					<a href="${process.env.SERVER_PUBLIC_URL}/verify_email/${email}/${token}">Verify</a>
				</div>
				
				`
				},
				function(err, info) {
					//callback function
					if (err) {
						reject(err);
					} else {
						resolve(email);
					}
				}
			);
		});
	});
};
