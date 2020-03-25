$(() => {
	$(".checkout-form").submit(e => {
		let retVal = false;
		$(e.target).removeClass("was-validated");
		$(e.target).addClass("was-validated");
		check_luhn();

		if (e.target.checkValidity() && luhn_checksum($("#cc-number").val()) == 0) {
			$(".processing").show();
			$(window).scrollTop(0);
			$(".checkout-form").css("filter", "blur(3px)");
			$("button[type=submit]")[0].disabled = true;
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
