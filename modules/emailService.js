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
		let orderRows = "";

		order.ProductList.forEach(line => {
			orderRows += `
			<tr>
                <td>${line.ProductName}</td>
                <td>${line.Qty}</td>
            </tr>
			`;
		});

		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: `Receipt for Order #${order._id}`,
			html: `
			<div style="font-family: Arial, Helvetica, sans-serif; text-align: center;">
				<h1>Thank you for your order!</h1>
				<p>
					Your order (<b>${order._id}</b>) was received and is being processed. Look out for an email letting you know when it
					has shipped!
				</p>
				
				<br>
				<h3>Your order:</h3>
				<br>
				
				<table style="width: 100%; text-align: center;">
					<thead style="background-color: rgba(0,0,0,0.1);">
						<tr>
							<th>Item</th>
							<th>Quantity</th>
						</tr>
					</thead>
					<tbody>
						${orderRows}
					</tbody>
					<tfoot>
						<tr>
							<td style="font-size: 25px; padding-top: 20px;" colspan="2">Total: <b>$${parseFloat(order.total).toFixed(2)}</b></td>
						</tr>
					</tfoot>
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

module.exports.sendUpdate = (email, order) => {
	return new Promise((resolve, reject) => {
		let orderRows = "";

		order.ProductList.forEach(line => {
			orderRows += `
			<tr>
                <td>${line.ProductName}</td>
                <td>${line.Qty}</td>
            </tr>
			`;
		});

		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: `Update for Order #${order._id}`,
			html: `
			<div style="font-family: Arial, Helvetica, sans-serif; text-align: center;">
				<h1>Thank you for your order!</h1>
				<p>
					Your order (<b>${order._id}</b>) was updated to: (<b>${order.status}</b>)
				</p>
				
				<br>
				<h3>Your order:</h3>
				<br>
				
				<table style="width: 100%; text-align: center;">
					<thead style="background-color: rgba(0,0,0,0.1);">
						<tr>
							<th>Item</th>
							<th>Quantity</th>
						</tr>
					</thead>
					<tbody>
						${orderRows}
					</tbody>
					<tfoot>
						<tr>
							<td style="font-size: 25px; padding-top: 20px;" colspan="2">Total: <b>$${parseFloat(order.total).toFixed(2)}</b></td>
						</tr>
					</tfoot>
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