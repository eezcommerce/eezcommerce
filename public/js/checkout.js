$(() => {
	$(".checkout-form").submit(e => {});

	new Cleave("#cc-number", {
		creditCard: true,
		onCreditCardTypeChanged: type => {
			$(".card-type li").css("color", "var(--muted)");
			switch (type) {
				case "visa":
					$("#type-visa").css("color", "var(--primary)");
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
