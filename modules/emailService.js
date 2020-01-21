/*
functions related to email verification & sending
*/


const nodemailer = require("nodemailer")
const crypto = require("crypto")



var dummyUsers = [
	{
		userId: 1,
		userName: "User Name",
		email: "email@email.com",
		token: "",
		password: "not_a_plaintext_password",
		verified: false
	},
	{
		userId: 2,
		userName: "User Name 2",
		email: "prj666_201a07@myseneca.ca",
		token: "",
		password: "not_a_plaintext_password",
		verified: false
	}
]


// creates a nodemailer transporter used to send email with transporter.sendMail() later
// this shouldn't need any further configuration if we're using the seneca email provided to us
var transporter = nodemailer.createTransport({
	host: 'smtp.office365.com',
	port: 587,		//MAKE SURE THIS PORT IS OPEN IN YOUR FIREWALL (Seneca blocks it)
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	},
	tls: {
		ciphers: 'SSLv3',
		requireTLS: true
	}
});


// sends a verification email to the provided email containing a secret, random token
// TODO: store the token in the user in the database
// used to verify in verifyEmailToken()
// Returns a promise, resolving with an error or the email provided
module.exports.sendVerificationEmail = (email) => {

	return new Promise((resolve, reject) => {


		// generate secure random bytes of data
		crypto.randomBytes(16, ((err, res) => {
			// convert bytes to hex string for writing to a URL
			let token = res.toString('hex')


			// TODO store token in DB
			// temp: just accessing array of fake users



			try {
				let user = dummyUsers.find((user) => {
					return (user.email == email)
				})

				user.token = token;
			} catch (error) {
				reject(error)
			}


			// send email with secret link
			// set up email data
			transporter.sendMail({
				from: process.env.EMAIL_USER,
				to: email,
				subject: `eEzCommerce email verification`,
				html: `
				<div>
					<h1>Verify your email.</h1>
				
					<p>Click the link below to verify your email:</p>
					<a href="http://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/verify_email/${email}/${token}">Verify</a>
				</div>
				
				`
			}, function (err, info) { 	//callback function
				if (err) {
					reject(err)
				} else {
					resolve(email);
				}
			});

		}))

	});
}



module.exports.verifyEmailToken = function (token, email) {
	return new Promise((resolve, reject) => {

		// TODO: update user in actual database
		let user = dummyUsers.find((user) => {
			return (user.email == email && user.token == token)
		})

		if (user) {
			try {
				user.verified = true;
				resolve(user.email)
			} catch (error) {
				reject({ error: "Couldn't activate user" })
			}
		} else {
			reject({ error: "Invalid token" })
		}

	})
}