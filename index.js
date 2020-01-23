require("dotenv").config();

const express = require("express");
var app = express();
var sessions = require("client-sessions");
var fs = require("fs");

// dependencies

// custom modules
const mailService = require(__dirname + "/modules/emailService.js");

// express middlewares & setup
app.use(express.static("public"));

app.use(
	sessions({
		cookieName: "auth",
		secret: process.env.SESSION_SECRET,
		duration: 1 * 1 * 60 * 1000, // HH * MM * SS * MS | fill with ones to the left
		activeDuration: 1 * 1 * 60 * 1000
	})
);

// ROUTES
// 		->	GET 	Place all GET routes here

app.get("/send_verification_email_test/:email", (req, res) => {
	let email = req.params.email;

	mailService
		.sendVerificationEmail(email, "id")
		.then(e => {
			res.send("Email sent to " + e);
		})
		.catch(e => {
			res.send("Couldn't send email. Check the URL and try again.");

			if (e.toString().indexOf("Greeting") >= 0) {
				console.log(
					e + "\n\n\n ***CHECK YOUR FIREWALL FOR PORT 587***"
				);
			}
		});
});

app.get("/verify_email/:email/:token", (req, res) => {
	let token = req.params.token;
	let email = req.params.email;

	mailService
		.verifyEmailToken(token, email)
		.then(email => {
			res.send(`The email ${email} has been verified.`);
		})
		.catch(error => {
			res.json(error);
		});
});

// this will move to the post route when form data is needed
app.get("/login", (req, res) => {
	// We're going to simulate a user that would be returned from the database
	const user = {
		id: 1,
		name: "John Smith",
		company: "Paintings4You",
		email: "email@email.com",
		password: "asecretnonplaintextpassword"
	};

	// this might look a bit weird, but it's using ES6 destructuring to strip the password field just to make SURE we're not passing it back and forth
	// it basically pulls out the password field from the user object if there is one, and collects all the remaining properties into the strippedUser object
	const { password, ...strippedUser } = user;

	req.auth.isLoggedIn = true;
	req.auth.userDetails = strippedUser;
	res.send("logged in");
});

app.get("/about_me", (req, res) => {
	if (req.auth.isLoggedIn) {
		res.json(req.auth);
	} else {
		res.sendStatus(403);
	}
});

app.get("/logout", (req, res) => {
	req.auth.isLoggedIn = false;
	req.auth.userDetails = {};
	res.send("logged out");
});

// ROUTES
// 		->	POST 	Place all POST routes here

// Express MiddleWares

// fallback for unknown routes
app.get("*", (req, res) => {
	res.send("404 NOT FOUND");
});

if (process.env.ENABLE_SSL) {
	try {
		var httpsOptions = {
			key: fs.readFileSync(__dirname + "/cert/prj666-2021.key"),
			cert: fs.readFileSync(__dirname + "/cert/prj666-2021.crt"),
			ca: [fs.readFileSync(__dirname + "/cert/RapidSSL_RSA_CA_2018.crt")]
		};
		var srv = require("https")
			.createServer(httpsOptions, app)
			.listen(443);
		console.log("https server listening on port 443");
	} catch (error) {
		console.error(error + "\n\n****\tWARNING: SSL IS NOT CONFIGURED\t****");
	}
}

// start listening
app.listen(process.env.SERVER_PORT || 8080, process.env.SERVER_HOSTNAME, () => {
	console.log(
		"http server listening on port " + process.env.SERVER_PORT || 8080
	);
});
