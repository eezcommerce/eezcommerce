require("dotenv").config();

// dependencies
const express = require("express");
var app = express();
var sessions = require("client-sessions");
var fs = require("fs");
var bodyParser = require("body-parser");

// custom modules
const mailService = require("./modules/emailService.js");
const userService = require("./modules/userService.js");

// express middlewares & setup
app.use(express.static("public"));

app.use(
	sessions({
		cookieName: "auth",
		secret: process.env.SESSION_SECRET,
		duration: 1 * 1 * 60 * 1000, // HH * MM * SS * MS | fill with ones to the left
		activeDuration: 1 * 60 * 60 * 1000
	})
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

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
				console.log(e + "\n\n\n ***CHECK YOUR FIREWALL FOR PORT 587***");
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

app.get("/about_me", (req, res) => {
	if (req.auth.isLoggedIn) {
		res.json(req.auth);
	} else {
		res.sendStatus(403);
	}
});

app.get("/dashboard", (req, res) => {
	if (req.auth.isLoggedIn) {
		res.sendFile(__dirname + "/public/views/Dashboard.html");
	} else {
		res.redirect("/");
	}
});

app.get("/logout", (req, res) => {
	req.auth.isLoggedIn = false;
	req.auth.userDetails = {};
	res.send("logged out <script>setTimeout(()=>{window.location = '/'}, 2000)</script>");
});

// ROUTES
// 		->	POST 	Place all POST routes here

app.post("/signup", (req, res) => {
	userService
		.create({ email: req.body.email, password: req.body.inputPassword })
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			res.json({ error: err });
		});
});

app.post("/login", (req, res) => {
	userService
		.authenticate(req.body.email, req.body.password)
		.then(user => {
			req.auth.isLoggedIn = true;
			req.auth.userDetails = user;
			res.json(user);
		})
		.catch(err => {
			res.json({ error: err });
		});
});

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
	console.log("http server listening on port " + process.env.SERVER_PORT || 8080);
});
