var app = angular.module("saotaApp", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider.when("/", {
		controller: "MainCtrl",
		templateUrl: "index.html"
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

	var firstPanoramaLightbox = document.querySelectorAll("#first-panorama-lightbox")[0];
	var secondPanoramaLightbox = document.querySelectorAll("#second-panorama-lightbox")[0];
	var thirdPanoramaLightbox = document.querySelectorAll("#third-panorama-lightbox")[0];
	var fourthPanoramaLightbox = document.querySelectorAll("#fourth-panorama-lightbox")[0];

	window.onclick = function(event) {
		if (!event.target.matches(".panorama-box")) {
			firstPanoramaLightbox.classList.remove("hide-lightbox");
			document.getElementById("first-panorama").style.height = "140px";
			secondPanoramaLightbox.classList.remove("hide-lightbox");
			document.getElementById("second-panorama").style.height = "140px";
			thirdPanoramaLightbox.classList.remove("hide-lightbox");
			document.getElementById("third-panorama").style.height = "140px";
			fourthPanoramaLightbox.classList.remove("hide-lightbox");
			document.getElementById("fourth-panorama").style.height = "140px";
		}
	}

	$scope.revealFirstPanorama = function() {
		angular.element(document).ready(function() {
			firstPanoramaLightbox.classList.add("hide-lightbox");
			document.getElementById("first-panorama").style.transition = "height 1s";
			document.getElementById("first-panorama").style.height = "500px";
		});
	};

	$scope.revealSecondPanorama = function() {
		angular.element(document).ready(function() {
			secondPanoramaLightbox.classList.add("hide-lightbox");
			document.getElementById("second-panorama").style.transition = "height 1s";
			document.getElementById("second-panorama").style.height = "500px";
		});
	};

	$scope.revealThirdPanorama = function() {
		angular.element(document).ready(function() {
			thirdPanoramaLightbox.classList.add("hide-lightbox");
			document.getElementById("third-panorama").style.transition = "height 1s";
			document.getElementById("third-panorama").style.height = "500px";
		});
	};

	$scope.revealFourthPanorama = function() {
		angular.element(document).ready(function() {
			fourthPanoramaLightbox.classList.add("hide-lightbox");
			document.getElementById("fourth-panorama").style.transition = "height 1s";
			document.getElementById("fourth-panorama").style.height = "500px";
		});
	};

	$scope.previewProject = function(event, imageUrl) {
		console.log(event.target.id);
		console.log(event.target);
		var lightbox = document.querySelectorAll("#background-lightbox")[0];
		lightbox.classList.add("show-lightbox");
		$scope.previewUrl = imageUrl;
		$scope.projectPageUrl = "http://www.saota.com/project/" + event.target.id + "/";

		var temp = "" + event.target.id + "";
		var split = temp.split("-");
		temp = split.join(" ");
		console.log(temp);
		$scope.projectName = temp.toUpperCase();
		console.log($scope.projectName);
	};

	$scope.removePreview = function() {
		var lightbox = document.querySelectorAll("#background-lightbox")[0];
		lightbox.classList.remove("show-lightbox");
	}

	$scope.showInstructions = function() {
		var lightbox = document.querySelectorAll("#background-lightbox-gear-vr")[0];
		lightbox.classList.add("show-lightbox");
	}

	$scope.removeInstructions = function() {
		var lightbox = document.querySelectorAll("#background-lightbox-gear-vr")[0];
		lightbox.classList.remove("show-lightbox");
	}

	var scrollDown = function() {
		var firstQuoteLocation = 372;
		var panoramaLocation = 887;

		if ($(window).scrollTop() >= 0 && $(window).scrollTop() < firstQuoteLocation) {
			$("html, body").animate({
				scrollTop: firstQuoteLocation
			}, "slow");
		} else if ($(window).scrollTop() >= firstQuoteLocation && $(window).scrollTop() < panoramaLocation) {
			$("html, body").animate({
				scrollTop: panoramaLocation
			}, "slow");
		} else if ($(window).scrollTop() >= panoramaLocation && $(window).scrollTop() < Math.round($("#our-virtual-reality-section").offset().top)) {
			$("html, body").animate({
				scrollTop: $("#our-virtual-reality-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() >= Math.round($("#our-virtual-reality-section").offset().top) && $(window).scrollTop() < Math.floor($("#model-section").offset().top)) {
			$("html, body").animate({
				scrollTop: $("#model-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() >= Math.floor($("#model-section").offset().top) && $(window).scrollTop() < Math.floor($("#second-quote-section").offset().top)) {
			$("html, body").animate({
				scrollTop: $("#second-quote-section").offset().top
			}, "slow");;
		} else if ($(window).scrollTop() >= Math.floor($("#second-quote-section").offset().top) && $(window).scrollTop() < Math.floor($("#download-section").offset().top)) {
			$("html, body").animate({
				scrollTop: $("#download-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() >= Math.floor($("#download-section").offset().top) && $(window).scrollTop() < $("#contact-section").offset().top) {
			$("html, body").animate({
				scrollTop: $("#contact-section").offset().top
			}, "slow");
		}
	};

	var scrollUp = function() {
		var firstQuoteLocation = 372;

		if ($(window).scrollTop() <= firstQuoteLocation && $(window).scrollTop() > $("#parallax-section").offset().top) {
			$("html, body").animate({
				scrollTop: $("#parallax-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() <= $("#panorama-section").offset().top && $(window).scrollTop() > firstQuoteLocation) {
			$("html, body").animate({
				scrollTop: firstQuoteLocation
			}, "slow");
		} else if ($(window).scrollTop() <= $("#our-virtual-reality-section").offset().top && $(window).scrollTop() > $("#panorama-section").offset().top) {
			$("html, body").animate({
				scrollTop: $("#panorama-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() <= $("#model-section").offset().top && $(window).scrollTop() > $("#our-virtual-reality-section").offset().top) {
			$("html, body").animate({
				scrollTop: $("#our-virtual-reality-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() <= $("#second-quote-section").offset().top && $(window).scrollTop() > $("#model-section").offset().top) {
			$("html, body").animate({
				scrollTop: $("#model-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() <= $("#download-section").offset().top && $(window).scrollTop() > $("#second-quote-section").offset().top) {
			$("html, body").animate({
				scrollTop: $("#second-quote-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() <= $("#contact-section").offset().top && $(window).scrollTop() > $("#download-section").offset().top) {
			$("html, body").animate({
				scrollTop: $("#download-section").offset().top
			}, "slow");
		} else if ($(window).scrollTop() > $("#contact-section").offset().top) {
			$("html, body").animate({
				scrollTop: $("#contact-section").offset().top
			}, "slow");
		}
	};

	$(document).keydown(function(event) {
		if (event.keyCode === 40) {
			scrollDown();
		} else if (event.keyCode === 38) {
			scrollUp();
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