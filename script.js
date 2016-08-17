$.mobile.linkBindingEnabled = false;
$.mobile.hashListeningEnabled = false;

var app = angular.module("saotaApp", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider.when("/", {
		controller: "MainCtrl",
		templateUrl: "templates/main.html"
	})

	$routeProvider.when("/mont-choisy", {
		controller: "MontChoisyCtrl",
		templateUrl: "templates/mont-choisy/mont-choisy-index.html"
	})

	$routeProvider.otherwise("/");
});

app.controller("MainCtrl", function($scope) {
	var ParallaxManager, ParallaxPart;

	ParallaxPart = (function() {
		function ParallaxPart(el) {
			this.el = el;
			this.speed = parseFloat(this.el.getAttribute('data-parallax-speed'));
			this.maxScroll = parseInt(this.el.getAttribute('data-max-scroll'));
		}

		ParallaxPart.prototype.update = function(scrollY) {
			if (scrollY > this.maxScroll) { return; }
			var offset = -(scrollY * this.speed);
			this.setYTransform(offset);
		};

		ParallaxPart.prototype.setYTransform = function(val) {
			this.el.style.webkitTransform = "translate3d(0, " + val + "px, 0)";
			this.el.style.MozTransform    = "translate3d(0, " + val + "px, 0)";
			this.el.style.OTransform      = "translate3d(0, " + val + "px, 0)";
			this.el.style.transform       = "translate3d(0, " + val + "px, 0)";
			this.el.style.msTransform     = "translateY(" + val + "px)";
		};

		return ParallaxPart;
	})();

	ParallaxManager = (function() {
		ParallaxManager.prototype.parts = [];

		function ParallaxManager(elements) {
			if (Array.isArray(elements) && elements.length) {
				this.elements = elements;
			}
			if (typeof elements === 'object' && elements.item) {
				this.elements = Array.prototype.slice.call(elements);
			} else if (typeof elements === 'string') {
				this.elements = document.querySelectorAll(elements);
				if (this.elements.length === 0) {
					throw new Error("Parallax: No elements found");
				}
				this.elements = Array.prototype.slice.call(this.elements);
			} else {
				throw new Error("Parallax: Element variable is not a querySelector string, Array, or NodeList");
			}
			for (var i in this.elements) {
				this.parts.push(new ParallaxPart(this.elements[i]));
			}
			window.addEventListener("scroll", this.onScroll.bind(this));
		}

		ParallaxManager.prototype.onScroll = function() {
			window.requestAnimationFrame(this.scrollHandler.bind(this));
		};

		ParallaxManager.prototype.scrollHandler = function() {
			var scrollY = Math.max(window.pageYOffset, 0);
			for (var i in this.parts) { this.parts[i].update(scrollY); }
		};

		return ParallaxManager;
	})();

	new ParallaxManager('.parallax-layer');

	$scope.showMenu = function() {
		var dropdownContent = document.getElementById("hamburger-dropdown-content");
		dropdownContent.classList.toggle("show-hamburger-dropdown");

		var button = document.querySelectorAll("#hamburger-button")[0];
		if (dropdownContent.classList.contains("show-hamburger-dropdown")) {
			button.style.backgroundColor = "#FBB03B";
		} else {
			button.style.backgroundColor = "#CACACA";
		}
	};

	$scope.hideMenu = function() {
		var dropdownContent = document.getElementById("hamburger-dropdown-content");
		dropdownContent.classList.remove("show-hamburger-dropdown");
		var button = document.querySelectorAll("#hamburger-button")[0];
		button.style.backgroundColor = "#CACACA";
	};

	window.onclick = function(event) {
		minimizePanorama("all");
		console.log(event.target.id);
		var dropdownContent = document.getElementById("hamburger-dropdown-content");
		if (dropdownContent.classList.contains("show-hamburger-dropdown")) {
			var targetID = event.target.id;
			var button = document.querySelectorAll("#hamburger-button")[0];
			if (targetID !== "hamburger-button" && targetID !== "hamburger-icon") {
				dropdownContent.classList.remove("show-hamburger-dropdown");
				button.style.backgroundColor = "#CACACA";
			}
		}
	};

	$(".panorama-box").on("vmousedown", function(event) {
		revealPanorama(event.target.id);
	});

	var revealPanorama = function(eventTarget) {
		var order = eventTarget.split("-");

		$("#" + order[0] + "-panorama-lightbox").addClass("hide-lightbox");
		$("#" + order[0] + "-panorama-lightbox-title").addClass("hide-lightbox");
		$("#" + order[0] + "-panorama").removeClass("default").addClass("extension");

		minimizePanorama(order[0]);
	};

	var minimizePanorama = function(currentOrder) {
		var order = ["first", "second", "third", "fourth"];
		for (var i = 0; i < order.length; i++) {
			if (order[i] === currentOrder) {
				continue;
			} else {
				$("#" + order[i] + "-panorama-lightbox").removeClass("hide-lightbox");
				$("#" + order[i] + "-panorama-lightbox-title").removeClass("hide-lightbox");
				$("#" + order[i] + "-panorama").removeClass("extension").addClass("default");
			}
		}
	};

	$scope.previewProject = function(event, imageUrl) {
		var lightbox = document.querySelectorAll("#background-lightbox")[0];
		lightbox.classList.add("show-lightbox");

		angular.element(document).ready(function() {
			var temp = event.target.id;
			var split = temp.split("-");
			temp = split.join(" ");
			$scope.projectName = temp.toUpperCase();
			$scope.previewUrl = imageUrl;
			$scope.projectPageUrl = "http://www.saota.com/project/" + event.target.id + "/";
		});

		var body = document.body;
		body.classList.add("no-scroll");
	};

	$scope.removePreview = function() {
		var lightbox = document.querySelectorAll("#background-lightbox")[0];
		lightbox.classList.remove("show-lightbox");
		var body = document.body;
		body.classList.remove("no-scroll");
	};

	$scope.showInstructions = function() {
		var lightbox = document.querySelectorAll("#background-lightbox-gear-vr")[0];
		lightbox.classList.add("show-lightbox");
		var body = document.body;
		body.classList.add("no-scroll");
	};

	$scope.removeInstructions = function() {
		var lightbox = document.querySelectorAll("#background-lightbox-gear-vr")[0];
		lightbox.classList.remove("show-lightbox");
		var body = document.body;
		body.classList.remove("no-scroll");
	};

	// Had to hard code these locations in because locations would change due to parallax and would
	// be a detriment to user experience as the navbar would not scroll to the same location
	var adjustLocations = function() {
		var width = $(window).width();
		parallaxLocation = 0;

		if (width <= 320) {
			videoLocation = 296;
			firstQuoteLocation = 448;
			panoramaLocation = 1033;
			ourVirtualRealityLocation = 1942;
			modelLocation = 3356;
			secondQuoteLocation = 4168;
			downloadLocation = 4934;
			contactLocation = 6224;
		} else if (width <= 425) {
			videoLocation = 296;
			firstQuoteLocation = 465;
			panoramaLocation = 1061;
			ourVirtualRealityLocation = 1961;
			modelLocation = 3356;
			secondQuoteLocation = 4069;
			downloadLocation = 4754;
			contactLocation = 6081;
		} else if (width <= 652) {
			videoLocation = 296;
			firstQuoteLocation = 512;
			panoramaLocation = 1092;
			ourVirtualRealityLocation = 1936;
			modelLocation = 3524;
			secondQuoteLocation = 4111;
			downloadLocation = 4787;
			contactLocation = 6357;
		} else if (width <= 770) {
			videoLocation = 309;
			firstQuoteLocation = 552;
			panoramaLocation = 1168;
			ourVirtualRealityLocation = 1998;
			modelLocation = 3763;
			secondQuoteLocation = 4389;
			downloadLocation = 5011;
			contactLocation = 6250;
		}else if (width <= 880) {
			videoLocation = 309;
			firstQuoteLocation = 968;
			panoramaLocation = 1292;
			ourVirtualRealityLocation = 2172;
			modelLocation = 3837;
			secondQuoteLocation = 4497;
			downloadLocation = 5183;
			contactLocation = 6392;
		} else {
			videoLocation = 377;
			firstQuoteLocation = 886;
			panoramaLocation = 1638;
			ourVirtualRealityLocation = 2522;
			modelLocation = 3665;
			secondQuoteLocation = 4274;
			downloadLocation = 5009;
			contactLocation = 6185;
		}
	};

	var parallaxLocation;
	var videoLocation;
	var firstQuoteLocation;
	var panoramaLocation;
	var ourVirtualRealityLocation;
	var modelLocation;
	var secondQuoteLocation;
	var downloadLocation;
	var contactLocation;
	adjustLocations();

	$(window).resize(function() {
		adjustLocations();
	});

	window.onscroll = function(event) {
		if ($(window).scrollTop() >= getFloor("#contact-section")) {
			setActive("contact-nav-button");
		} else if ($(window).scrollTop() >= getFloor("#download-section")) {
			setActive("download-nav-button");
		} else if ($(window).scrollTop() >= getFloor("#second-quote-section")) {
			setInactive("all");
		} else if ($(window).scrollTop() >= getFloor("#model-section")) {
			setActive("model-nav-button");
		} else if ($(window).scrollTop() >= getFloor("#our-virtual-reality-section")) {
			setActive("about-nav-button");
		} else if ($(window).scrollTop() >= getFloor("#panorama-section")) {
			setActive("featured-projects-nav-button");
		} else if ($(window).scrollTop() >= getFloor("#first-quote-section")) {
			setInactive("all");
		} else if ($(window).scrollTop() >= videoLocation) {
			setActive("video-nav-button");
		} else if ($(window).scrollTop() >= 0) {
			setInactive("all");
		}

		var navbarLogo = document.querySelectorAll("#navbar-logo")[0];
		var navbarButtons = document.querySelectorAll("#navbar-buttons")[0];
		if ($(window).scrollTop() >= videoLocation) {
			navbarLogo.classList.add("show-logo");
			navbarButtons.classList.remove("centered");
			$("li").css({
				"float": "right",
				"display": "block"
			});
		} else {
			navbarLogo.classList.remove("show-logo");
			navbarButtons.classList.add("centered");
			$("li").css({
				"float": "none",
				"display": "inline-block"
			});
		}
	};

	var setActive = function(name) {
		angular.element(document).ready(function() {
			var button = document.getElementById(name);
			button.classList.add("active");
		});
		setInactive(name);
	};

	var setInactive = function(name) {
		var buttonNames = ["video-nav-button", "featured-projects-nav-button", "about-nav-button", "model-nav-button", "download-nav-button", "contact-nav-button"];
		angular.element(document).ready(function() {
			for (var i = 0; i < buttonNames.length; i++) {
				if (buttonNames[i] !== name) {
					var button = document.getElementById(buttonNames[i]);
					button.classList.remove("active");
				}
			}
		});
	};

	$scope.jumpTo = function(event) {
		console.log(event.target.id);
		var destination;

		switch(event.target.id) {
			case "video-nav-button":
				destination = videoLocation;
				break;
			case "featured-projects-nav-button":
				destination = panoramaLocation;
				break;
			case "about-nav-button":
				destination = ourVirtualRealityLocation;
				break;
			case "model-nav-button":
				destination = modelLocation;
				break;
			case "download-nav-button":
				destination = downloadLocation;
				break;
			case "contact-nav-button":
				destination = contactLocation;
				break;
		}

		$("html, body").animate({
			scrollTop: destination
		}, "slow");
	};

	var scrollDownTo = function(location1, location2) {
		if ($(window).scrollTop() >= location1 && $(window).scrollTop() < location2) {
			$("html, body").animate({
				scrollTop: location2
			}, "slow");
		}
	};

	var scrollUpTo = function(location1, location2) {
		if ($(window).scrollTop() <= location1 && $(window).scrollTop() > location2) {
			$("html, body").animate({
				scrollTop: location2
			}, "slow");
		}
	};

	var getFloor = function(sectionID) {
		return Math.floor($(sectionID).offset().top);
	};

	$(document).keydown(function(event) {
		if (event.keyCode === 40) {
			scrollDownTo(parallaxLocation, videoLocation);
			scrollDownTo(videoLocation, firstQuoteLocation);
			scrollDownTo(firstQuoteLocation, panoramaLocation);
			scrollDownTo(panoramaLocation, ourVirtualRealityLocation);
			scrollDownTo(ourVirtualRealityLocation, modelLocation);
			scrollDownTo(modelLocation, secondQuoteLocation);
			scrollDownTo(secondQuoteLocation, downloadLocation);
			scrollDownTo(downloadLocation, contactLocation);
		} else if (event.keyCode === 38) {
			scrollUpTo(videoLocation, parallaxLocation);
			scrollUpTo(firstQuoteLocation, videoLocation);
			scrollUpTo(panoramaLocation, firstQuoteLocation);
			scrollUpTo(ourVirtualRealityLocation, panoramaLocation);
			scrollUpTo(modelLocation, ourVirtualRealityLocation);
			scrollUpTo(secondQuoteLocation, modelLocation);
			scrollUpTo(downloadLocation, secondQuoteLocation);
			scrollUpTo(contactLocation, downloadLocation);
			scrollUpTo($(document).height(), contactLocation);
		} else if (event.keyCode === 13) {
			console.log($(window).scrollTop());
		}
	});

	$(function() {
		$('a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top
					}, 1000);
					return false;
				}
			}
		});
	});
});

app.controller("MontChoisyCtrl", function($scope) {
	$scope.revealPanorama = function(order) {
		$("#" + order + "-panorama-lightbox").addClass("hide-lightbox");
		$("#" + order + "-panorama-container").addClass("extension");
		minimizePanorama(order);
	};

	window.onclick = function(event) {
		var className = $(event.target).attr("class");
		if (className === undefined) {
			minimizePanorama("all");
		} else if (!className.includes("panorama")) {
			minimizePanorama("all");
		}
	};

	var minimizePanorama = function(currentOrder) {
		var order = ["first", "second", "third"];
		for (var i = 0; i < order.length; i++) {
			if (order[i] === currentOrder) {
				continue;
			} else {
				$("#" + order[i] + "-panorama-lightbox").removeClass("hide-lightbox");
				$("#" + order[i] + "-panorama-container").removeClass("extension");
			}
		}
	};
});