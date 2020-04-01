// document ready
$(() => {
	// setting state of form
	$("#agreeTerms").prop("checked", false);

	// prevent submission of forms with this class until validated
	$(".needs-validation").submit(e => {
		// get the form we're working with $() just wraps it in a jquery query so that we can use jquery functions
		let form = $(e.target);
		// stop form from submitting by default
		e.preventDefault();

		// tell the form that we've validated it manually so that bootstrap can do our styling
		form.addClass("was-validated");

		// reset the response message from the server in case there was one sent before
		form
			.find(".server-response")
			.html("")
			.removeClass("d-block");

		//.checkValidity() is a browser api method that checks if the form is valid according to the html attributes
		// the [0] after form is to access the raw DOM element since it was wrapped in jquery before (same result as just e.target)
		// if the form is valid (so checkvalidity is true) we can do our posting of data (submit the form to the "action" attribute url)
		if (form[0].checkValidity()) {
			var loader = $(".loader-block");
			loader.addClass("d-flex");

			if (form.find(":file").length === 1) {
				let formdata = new FormData(form[0]);

				$.ajax({
					url: form.attr("action"),
					contentType: false,
					processData: false,
					enctype: "multipart/form-data",
					data: formdata,
					method: "POST",
					success: data => {
						// if theres an error, put it in the element with the class "server-response" and show that element
						if (data.error) {
							form.removeClass("was-validated");
							form
								.find(".server-response")
								.html(data.error)
								.addClass("d-block");
							loader.removeClass("d-flex");
						} else {
							$("#categoryAdd").removeClass("is-invalid");
							// the server will respond with a redirect url. if everything goes well, we should go there
							window.location = data.redirectUrl;
						}
					}
				});
			} else {
				$.post(form.attr("action"), form.serialize(), data => {
					// if theres an error, put it in the element with the class "server-response" and show that element
					if (data.error) {
						form.removeClass("was-validated");
						//specific for seperate
						$("#emailReset").addClass("is-invalid");
						$("#productSKU").addClass("is-invalid");
						$("#categoryAdd").addClass("is-invalid");
						form
							.find(".server-response")
							.html(data.error)
							.addClass("d-block");
						loader.removeClass("d-flex");
					} else {
						$("#categoryAdd").removeClass("is-invalid");
						// the server will respond with a redirect url. if everything goes well, we should go there
						window.location = data.redirectUrl;
					}
				});
			}
		}
	});

	// jquery shorthand for the "change" event.
	//confirmablePassword is a class I made to say we need to ensure this password will be equal to the confirm password field
	$(".confirmablePassword").change(e => {
		// the input element of the original password
		let input = $(e.target);
		// here we set the "pattern" attribute of the "confirm password" input to be equal to the raw string of the original input
		// this uses the built in html attributes to ensure the two will be exactly equal
		// this raw string isn't passed to the server, so it's harmless
		// since we're using the default html pattern attribute, all the feedback will be provided without additional code (same as any other input)
		$(".confirmablePasswordDestination").attr("pattern", input.val());
	});

	// we add the checkpatternwhentyping class to any input we want to be checked as we type
	$(".checkPatternWhenTyping").keyup(e => {
		let elem = $(e.target);
		let pattern = elem.attr("pattern");
		let isvalid = new RegExp(pattern).test(elem.val());

		isvalid ? elem.removeClass("is-invalid").addClass("is-valid") : elem.removeClass("is-valid").addClass("is-invalid");
	});

	// clear all of the inputs and validation messages when a form is dismissed
	$(".modal").on("hidden.bs.modal", function() {
		$(this)
			.find("form")
			.removeClass("was-validated")
			.trigger("reset");
		$(this)
			.find("input")
			.removeClass("is-invalid")
			.removeClass("is-valid");
		$(this)
			.find("#avatar")
			.attr("src", "/img/default_profile.jpg");
	});

	$("#dashboardMenuToggle").click(() => {
		if (!$(".sidebar").hasClass("sidebarOpen")) {
			$(".sidebar").addClass("sidebarOpen");
		} else {
			$(".sidebar").removeClass("sidebarOpen");
		}
	});
});
