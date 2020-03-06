// simpleGuard by Luca Cataldo
// a simple way to guard your express app from wanderers

var sessions;

try {
	var sessions = require("client-sessions");
} catch (error) {
	console.log("\n\nsimpleGuard requires the npm module client-sessions\n\n");
	process.exit();
}

var config = {
	password: "secret"
};

/**
 * @function start A constructor that initializes and starts the module
 * @param app Your express app (after you call the express constructor)
 * @param password Initializes your password DON'T HARDCODE
 * @param secret Secret, unguessable string for cookie encryption
 * @param activeDuration default=15, sets cookie active duration in minutes
 */
module.exports = (app, password, secret, activeDuration = 15) => {
	// set up the password
	config.password = password;

	// can't be less than 1 minute
	activeDuration = activeDuration < 1 ? 1 : activeDuration;

	// configure the session cookie called simpleGuard
	app.use(
		sessions({
			cookieName: "simpleGuard",
			secret: secret, // change this, too
			duration: 1 * activeDuration * 60 * 1000, // HH * MM * SS * MS | fill with ones to left
			activeDuration: 1 * 2 * 60 * 1000
		})
	);

	// this needs to come first because it's the most specific route
	app.get("/simpleGuard/authenticate", (req, res) => {
		if (req.query.password == config.password) {
			req.simpleGuard.isValid = true;
			res.redirect("/");
		} else {
			req.simpleGuard.isValid = false;
			res.redirect("/simpleGuard?invalid=true");
		}
	});

	app.get("/simpleGuard/logout", (req, res) => {
		req.simpleGuard.isValid = false;
		res.redirect("/");
	});

	// Using a GET route instead of a POST route isn't ideal as the
	// "password" is passed as a URL parameter but it's
	// good enough here and keeps dependencies to a minimum
	app.get("/simpleGuard", (req, res) => {
		if (req.query.invalid == false || req.query.invalid == undefined) {
			// we don't really care about valid html here, just send a form
			res.send(`
				<h3>Please enter your provided password</h3>
				<form method="GET" action="/simpleGuard/authenticate">
					<label for="password">
					<input autofocus autocomplete="new-password" type="password" name="password" required maxlength="64">
					<input type="submit">
				</form>

			`);
		} else {
			// we don't really care about valid html here, just send a form
			res.send(`
				<h1 style="color: red">INVALID PASSWORD</h1>
				<h3>Please enter your provided password</h3>
				<form method="GET" action="/simpleGuard/authenticate">
					<label for="password">
					<input autofocus autocomplete="new-password" type="password" name="password" required maxlength="64">
					<input type="submit">
				</form>

			`);
		}
	});

	// check the cookie on every request
	app.use((req, res, next) => {
		req.simpleGuard.isValid === true ? next() : res.redirect("/simpleGuard");
	});
};
