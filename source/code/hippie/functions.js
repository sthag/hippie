// This is called everytime
function setup () {
	'use strict';

	console.info('\n', hippie.brand, '\n\n');
	if (debugOn) {
		console.info('Debug information:\n', 'HTML:', hippie.screen, 'BODY:', hippie.body);
	}

	// WANNABE MODULE Mouse over effect
	// With CSS only
	if ($('#js_mob').length && viewHover) {
		$('#js_mob').addClass('mouse_over');
	}
	// if (viewHover) {
	// 	$('body').prepend('<div id="js_mob" class="mouse_over"></div>');
	// }
	// With JS
}

// MODULE Scroll navigation
// Using constructor function
function HippieScroll ($tp, $dn) {
	'use strict';

	// this.$tp = $tp;
	// Define initial situation
	let initLeft = false;
	const initY = hippie.screen.vh;

	$tp.addClass('hide');

	// Check scroll position and toggle element
	this.check = function () {
		hippie.screen.y = Math.min($(document).scrollTop(), document.documentElement.scrollTop);
		if (hippie.screen.y > initY) {
			if (!initLeft) {
				$tp.removeClass('hide');
				console.info('Initial viewport left');
			}
			initLeft = true;
		} else {
			if (initLeft) {
				$tp.addClass('hide');
				console.info('Initial viewport entered');
			}
			initLeft = false;
		}
	};

	// Add events to navigation elements
	$tp.click(function (event) {
		event.preventDefault();
		$('html, body').stop().animate({
			scrollTop: 0
		}, basicEase);
		// console.log('Scrolled to top');
	});
	$dn.click(function (event) {
		event.preventDefault();
		var pos = Math.max(hippie.screen.dh, hippie.body.h) - hippie.screen.vh;
		$('html').scrollTop(pos);
		// document.documentElement.scrollTop = pos;
		console.info('Scrolled down to', pos);
	});
}

// MODULE Meta elements
function HippieMeta ($ma, $pp) {
	'use strict';

	let metaOn = false;

	$ma.click(function () {
		var $wrap, $pop;

		// if (metaOn !== true) {
		if (!metaOn) {
			metaOn = true;

			$pp.each(function () {
				// if ($(this).css('position') === 'static') {
				// 	$(this).addClass('js_changed_pos');
				// 	$(this).css('position', 'relative');
				// }
				// $pop = $(this).next('.exp_pop').detach();
				// $wrap = $(this).wrap('<span class="exp_wrap"></span>').parent().prepend('<span class="exp_overlay"></span>').prepend('<span class="exp_marker_pop"></span>');
				// $wrap.after($pop);

				$('<div></div>').addClass('exp_overlay').css({
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: 0,
					left: 0
				}).appendTo($(this).addClass('exp_wrap'));

				// Displays explanation popup following the mouse
				$(this).on({
					mouseenter: function () {
						// if ($(this).attr('emmet')) {
						//
						// }
						$(this).next('.exp_pop').show();
					},
					mouseleave: function () {
						$(this).next('.exp_pop').hide();
					},
					mousemove: function (event) {
						$(this).next('.exp_pop').css({
							'top': event.pageY - $(this).next('.exp_pop').outerHeight() - 4,
							'left': event.pageX + 8
							// 'left': event.pageX - $(this).offset().left + 8
						});
					}
				})
			});

		} else {
			$pp.each(function () {
				$(this).off('mouseenter mouseleave mousemove');

				$(this).removeClass('exp_wrap').find('.exp_overlay').remove();
				// $wrap = $(this).parent('.exp_wrap');
				// $pop = $wrap.next('.exp_pop').detach();
				// $wrap.find('.exp_marker_pop').remove();
				// $(this).unwrap('.exp_wrap');
				// $(this).after($pop);
				// if ($(this).hasClass('js_changed_pos')) {
				// 	$(this).css('position', '');
				// 	if ($(this).attr('style') === '') {
				// 		$(this).removeAttr('style');
				// 	}
				// 	$(this).removeClass('js_changed_pos');
				// }
			});

			metaOn = false;
		}
		console.log('Explanation mode', metaOn);
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
