// This is called everytime
function setup () {
	'use strict';
	console.info('\n', hippie.brand, '\n\n');
	if (debugOn) {
		console.log('Debug information:\n', 'HTML:', hippie.screen, 'BODY:', hippie.body);
	}
	if ($('#js_tph').length && viewHover) {
		// $('body').prepend("<div id=\"js_tph\" class=\"layer__hover hover_full_view_change\"></div>");
		$('#js_tph').addClass("hover_full_view_change");
	}
}

// MODULE Scroll navigation
function HippieScroll ($el) {
	'use strict';
	// this.$el = $el;
	// console.log('Elements:', $el, this.$el);

	// Toggle display on scroll position
	// console.log('Scroll object added');
	this.check = function () {
		// console.log('Scroll position checked');
		hippie.screen.y = Math.min($(document).scrollTop(), document.documentElement.scrollTop);
		if (hippie.screen.y > initY) {
			if (!initLeft) {
				$el.parent().removeClass('magic');
				console.info('Initial viewport left');
			}
			initLeft = true;
		} else {
			if (initLeft) {
				$el.parent().addClass('magic');
				console.info('Initial viewport entered');
			}
			initLeft = false;
		}
	};
	// Add events to navigation elements
	$('.js_scrolltop').click(function (event) {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: 0
		}, basicEase);
		// console.log('Scrolled to top');
	});
	$('.js_scrolldown').click(function (event) {
		event.preventDefault();
		var pos = Math.max(hippie.screen.dh, hippie.body.h) - hippie.screen.vh;
		$('html').scrollTop(pos);
		// document.documentElement.scrollTop = pos;
		console.info('Scrolled down to', pos);
	});
}

// get document coordinates of the element
// function getCoords (elem) {
// 	let box = elem.getBoundingClientRect();
//
// 	return {
// 		top: box.top + pageYOffset,
// 		left: box.left + pageXOffset
// 	};
// }

// https://stackoverflow.com/a/488073/1444149
// function Utils () {}
//
// Utils.prototype = {
// 	constructor: Utils,
// 	isElementInView: function (element, fullyInView) {
// 		var pageTop = $(window).scrollTop();
// 		var pageBottom = pageTop + $(window).height();
// 		var elementTop = $(element).offset().top;
// 		var elementBottom = elementTop + $(element).height();
//
// 		if (fullyInView === true) {
// 			return ((pageTop < elementTop) && (pageBottom > elementBottom));
// 		} else {
// 			return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
// 		}
// 	}
// };
//
// var Utils = new Utils();

// TEST

function scrollNav () {
	'use strict';
	$('.nav a').click(function () {
		//Toggle Class
		$(".active").removeClass("active");
		$(this).closest('li').addClass("active");
		var theClass = $(this).attr("class");
		$('.'+theClass).parent('li').addClass('active');
		//Animate
		$('html, body').stop().animate({
			scrollTop: $( $(this).attr('href') ).offset().top - 160
		}, 400);
		return false;
	});
	$('.scrollTop a').scrollTop();
}
