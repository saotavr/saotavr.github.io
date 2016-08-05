var app = angular.module("saotaApp", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider.when("/", {
		controller: "MainCtrl",
		templateUrl: "index.html"
	})

	$routeProvider.otherwise("/");
});

app.controller("MainCtrl", function($scope) {
	$scope.test = function() {
		console.log("Touch event firing");
	};

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
	}

	$scope.goToVideo = function() {
		angular.element(document).ready(function() {
			$("html, body").animate({
				scrollTop: 390
			}, "slow");
		});
	};

	var firstPanoramaLightbox = document.querySelectorAll("#first-panorama-lightbox")[0];
	var secondPanoramaLightbox = document.querySelectorAll("#second-panorama-lightbox")[0];
	var thirdPanoramaLightbox = document.querySelectorAll("#third-panorama-lightbox")[0];
	var fourthPanoramaLightbox = document.querySelectorAll("#fourth-panorama-lightbox")[0];

	var firstPanoramaBox = document.querySelectorAll("#first-panorama")[0];
	var firstPanoramaLightboxTitle = document.querySelectorAll("#first-panorama-lightbox-title")[0];

	window.onclick = function(event) {
		minimizePanorama("all");
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
	};

	$scope.removePreview = function() {
		var lightbox = document.querySelectorAll("#background-lightbox")[0];
		lightbox.classList.remove("show-lightbox");
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

	var videoLocation = 390;
	var firstQuoteLocation = 960;

	window.onscroll = function(event) {
		if ($(window).scrollTop() >= Math.floor($("#contact-section").offset().top)) {
			setActive("contact-nav-button");
		} else if ($(window).scrollTop() >= Math.floor($("#download-section").offset().top)) {
			setActive("download-nav-button");
		} else if ($(window).scrollTop() >= Math.floor($("#second-quote-section").offset().top)) {
			setInactive("all"); // All buttons become inactive
		} else if ($(window).scrollTop() >= Math.floor($("#model-section").offset().top)) {
			setActive("model-nav-button");
		} else if ($(window).scrollTop() >= Math.floor($("#our-virtual-reality-section").offset().top)) {
			setActive("about-nav-button");
		} else if ($(window).scrollTop() >= Math.floor($("#panorama-section").offset().top)) {
			setActive("featured-projects-nav-button");
		} else if ($(window).scrollTop() >= Math.floor($("#first-quote-section").offset().top)) {
			setInactive("all");
		} else if ($(window).scrollTop() >= videoLocation) {
			setActive("video-nav-button");
		} else if ($(window).scrollTop() >= 0) {
			setInactive("all");
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

	var scrollDown = function() {
		if ($(window).scrollTop() >= 0 && $(window).scrollTop() < videoLocation) {
			$("html, body").animate({
				scrollTop: videoLocation
			}, "slow");
		} else if ($(window).scrollTop() >= videoLocation && $(window).scrollTop() < firstQuoteLocation) {
			$("html, body").animate({
				scrollTop: firstQuoteLocation
			}, "slow");
		} else if ($(window).scrollTop() >= firstQuoteLocation && $(window).scrollTop() < Math.floor($("#panorama-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#panorama-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() >= Math.floor($("#panorama-section").offset().top) && $(window).scrollTop() < Math.floor($("#our-virtual-reality-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#our-virtual-reality-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() >= Math.floor($("#our-virtual-reality-section").offset().top) && $(window).scrollTop() < Math.floor($("#model-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#model-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() >= Math.floor($("#model-section").offset().top) && $(window).scrollTop() < Math.floor($("#second-quote-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#second-quote-section").offset().top)
			}, "slow");;
		} else if ($(window).scrollTop() >= Math.floor($("#second-quote-section").offset().top) && $(window).scrollTop() < Math.floor($("#download-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#download-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() >= Math.floor($("#download-section").offset().top) && $(window).scrollTop() < Math.floor($("#contact-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#contact-section").offset().top)
			}, "slow");
		}
	};

	var scrollUp = function() {
		if ($(window).scrollTop() <= videoLocation && $(window).scrollTop() > Math.floor($("#parallax-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#parallax-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() <= Math.floor($("#first-quote-section").offset().top) && $(window).scrollTop() > videoLocation) {
			$("html, body").animate({
				scrollTop: videoLocation
			}, "slow");
		} else if ($(window).scrollTop() <= Math.floor($("#panorama-section").offset().top) && $(window).scrollTop() > Math.floor($("#first-quote-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#first-quote-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() <= Math.floor($("#our-virtual-reality-section").offset().top) && $(window).scrollTop() > Math.floor($("#panorama-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#panorama-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() <= Math.floor($("#model-section").offset().top) && $(window).scrollTop() > Math.floor($("#our-virtual-reality-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#our-virtual-reality-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() <= Math.floor($("#second-quote-section").offset().top) && $(window).scrollTop() > Math.floor($("#model-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#model-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() <= Math.floor($("#download-section").offset().top) && $(window).scrollTop() > Math.floor($("#second-quote-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#second-quote-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() <= Math.floor($("#contact-section").offset().top) && $(window).scrollTop() > Math.floor($("#download-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#download-section").offset().top)
			}, "slow");
		} else if ($(window).scrollTop() > Math.floor($("#contact-section").offset().top)) {
			$("html, body").animate({
				scrollTop: Math.floor($("#contact-section").offset().top)
			}, "slow");
		}
	};

	$(document).keydown(function(event) {
		if (event.keyCode === 40) {
			scrollDown();
		} else if (event.keyCode === 38) {
			scrollUp();
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