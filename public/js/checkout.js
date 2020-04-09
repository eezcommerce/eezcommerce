$(() => {
	$(".checkout-form").submit(async e => {
		let retVal = false;
		$(e.target).removeClass("was-validated");
		$(e.target).addClass("was-validated");
		check_luhn();

		if (e.target.checkValidity() && luhn_checksum($("#cc-number").val()) == 0) {
			$(".processing").show();
			$(window).scrollTop(0);
			$(".checkout-form").css("filter", "blur(3px)");
			$("button[type=submit]")[0].disabled = true;
			await createStripeToken();
			retVal = true;
		} else {
			check_luhn();
		}

		return retVal;
	});

	$(".checkout-form input").focus(function() {
		this.placeholder = "";
	});

	$("#cc-number").keyup(function() {
		check_luhn();
	});

	new Cleave("#cc-number", {
		creditCard: true,
		onCreditCardTypeChanged: type => {
			$(".card-type .text-dark").removeClass("text-dark");
			switch (type) {
				case "visa":
					$("#type-visa").addClass("text-dark");
					break;
				case "amex":
					$("#type-amex").addClass("text-dark");
					break;
				case "mastercard":
					$("#type-mc").addClass("text-dark");
					break;
				default:
					break;
			}
		}
	});

	new Cleave("#postal", {
		blocks: [3, 3],
		uppercase: true
	});

	new Cleave("#cc-expiration", {
		date: true,
		datePattern: ["m", "y"]
	});
});

function luhn_checksum(code) {
	code = code.replace(/\s/g, "");

	var len = code.length;
	var parity = len % 2;
	var sum = 0;
	for (var i = len - 1; i >= 0; i--) {
		var d = parseInt(code.charAt(i));
		if (i % 2 == parity) {
			d *= 2;
		}
		if (d > 9) {
			d -= 9;
		}
		sum += d;
	}
	return sum % 10;
}

function check_luhn() {
	let input = $("#cc-number");

	let clean = input.val().replace(/\s/g, "");

	if (luhn_checksum(input.val()) == 0 && clean.length > 14) {
		input[0].setCustomValidity("");
		input.removeClass("is-invalid");
		input.addClass("is-valid");
	} else {
		input[0].setCustomValidity("Invalid card number");
		input.removeClass("is-valid");
		input.addClass("is-invalid");
	}
}

/*
Validation for Stripe
*/
function createStripeToken() {
	return new Promise((resolve, reject) => {
		Stripe.setPublishableKey("pk_test_mQ9uHoIakoSM0VNVxlFXKgDV00Kj6dDTa9");
		$("#charge-error").removeClass("hidden");
		//credit card number must have no spaces
		Stripe.card.createToken(
			{
				number: $("#cc-number")
					.val()
					.split(" ")
					.join(""),
				cvc: $("#cc-cvv").val(),
				exp: $("#cc-expiration").val(),
				name: $("#cc-name").val()
			},
			(status, response) => {
				if (response.error) {
					// Problem!
					// Show the errors on the form
					$("#charge-error").text(response.error.message);
					$("#charge-error").removeClass("hidden");
					//$form.find('button').prop('disabled', false); // Re-enable submission
					console.log("failed to create token");
				} else {
					// Token was created!

					// Get the token ID:
					var token = response.id;

					console.log("Created Token! " + token);
					// Insert the token into the form so it gets submitted to the server:
					// var $form = $("#checkout-form");
					// $form.append($('<input type="hidden" name="stripeToken" />').val(token));

					$("#stripeToken").val(token);
					resolve();
				}
			}
		);
	});
}
