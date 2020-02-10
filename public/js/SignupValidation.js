(function () {
	"use strict";
	window.addEventListener(
		"load",
		function () {
			// Fetch all the forms we want to apply custom Bootstrap validation styles to
			var forms = document.getElementsByClassName("needs-validation");
			// Loop over them and prevent submission
			var validation = Array.prototype.filter.call(forms, function (form) {
				form.addEventListener(
					"submit",
					function (event) {
						if (form.checkValidity() === false) {
							event.preventDefault();
							event.stopPropagation();
						}
						form.classList.add("was-validated");
					},
					false
				);
			});
		},
		false
	);
})();

$(document).ready(function () {
	// Check if passwords match
	$("#inputPassword, #confirmPassword").on("keyup", function () {
		if (
			$("#inputPassword").val() != "" &&
			$("#confirmPassword").val() != "" &&
			$("#inputPassword").val() == $("#confirmPassword").val()
		) {
			$("#submitBtn").attr("disabled", false);
			$("#cPwdValid").show();
			$("#cPwdInvalid").hide();
			$("#confirmPassword").removeClass("is-invalid");
			$(".pwds").removeClass("is-invalid");
		} else {
			$("#submitBtn").attr("disabled", true);
			$("#cPwdValid").hide();
			$("#cPwdInvalid").show();
			$("#confirmPassword").addClass("is-invalid");
			$("#cPwdInvalid")
				.html("Passwords must match!")
				.css("color", "red");
			$(".pwds").addClass("is-invalid");
		}
	});

	//Clear modal on hide
	$("#signupModalCenter").on("hidden.bs.modal", function () {
		$(this)
			.find("form")
			.trigger("reset");
	});
	$("#loginModalCenter").on("hidden.bs.modal", function () {
		$(this)
			.find("form")
			.trigger("reset");
	});

	let currForm1 = document.getElementById("createAccount");
	// Validate on submit:
	currForm1.addEventListener(
		"submit",
		function (event) {
			if (currForm1.checkValidity() === false) {
				event.preventDefault();
				event.stopPropagation();
			} else {
				event.preventDefault();
				$.post("/signup", $(currForm1).serialize(), (data) => {
					if (data.error) {
						alert(data.error);
					} else {
						window.location = data.redirectUrl;
					}
				})
			}
			currForm1.classList.add("was-validated");
		},
		false
	);
	// Validate on input:
	currForm1.querySelectorAll(".form-control").forEach(input => {
		input.addEventListener("input", () => {
			if (input.checkValidity()) {
				input.classList.remove("is-invalid");
				input.classList.add("is-valid");
			} else {
				input.classList.remove("is-valid");
				input.classList.add("is-invalid");
			}
			var is_valid = $(".form-control").length === $(".form-control.is-valid").length;
			$("#submitBtn").attr("disabled", !is_valid);
		});
	});


	$("#authenticateLogin").submit(function (e) {
		e.preventDefault();
		e.stopPropagation();
		$.post("/login", $("#authenticateLogin").serialize(), (data) => {
			console.log(data);
			if (data.error || data.error === null) {
				alert(data.error);
			} else {
				window.location = data.redirectUrl;
			}
		})
	})
});


