$(function() {
	function delay(time) {
		return new Promise(resolve => {
			window.setTimeout(() => {
				resolve();
			}, time);
		});
	}

	function dotrans() {
		var tl = gsap.timeline();
		tl.to(".float-up", { duration: 0.3, opacity: 0, x: -100, stagger: 0.05 });
		tl.to(".loader li", { transformOrigin: "bottom left", duration: 0.5, scaleY: 1, stagger: 0.05 }, "-=0.25");
		tl.to(".loader li", { transformOrigin: "top left", duration: 0.3, scaleY: 0, stagger: 0.05 });
	}

	function floatIn() {
		var tl = gsap.timeline();
		tl.set(".float-up", { opacity: 0, y: 30 });
		tl.to(".float-up", { duration: 0.5, opacity: 1, y: 0, stagger: 0.1 });
	}

	barba.init({
		sync: true,
		prefetchIgnore: true,
		transitions: [
			{
				async leave(data) {
					const done = this.async();
					dotrans();
					await delay(800);
					done();
				},
				async enter(data) {
					floatIn();
					createListeners();
				},
				async once(data) {
					floatIn();
				}
			}
		],
		prevent: ({ el }) => el.classList && el.classList.contains("prevent")
	});

	$(document).on("click", ".s-1-done", e => {
		let query =
			"?name=" +
			encodeURIComponent(
				$("body")
					.find(".s-1-in")
					.val()
			);

		barba.go($(e.target).data("href") + query);
	});

	function createListeners() {
		$("body")
			.find(".wizard-avatar")
			.submit(e => {
				e.preventDefault();
				e.stopPropagation();

				let formdata = new FormData();

				if ($("#wizard-file").prop("files").length > 0) {
					file = $("#wizard-file").prop("files")[0];
					formdata.append("avatarImg", file);
					$.ajax({
						url: "/uploadAvatar",
						type: "POST",
						data: formdata,
						processData: false,
						contentType: false,
						success: data => {
							barba.go("/dashboard/wizard/four");
						}
					});
				}
			});
	}

	createListeners();
});
