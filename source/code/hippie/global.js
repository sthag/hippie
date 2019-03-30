// Setup
// -----------------------------------------------------------------------------
setup();

// DOM ready
// -----------------------------------------------------------------------------
$(document).ready(function() {
	'use strict';

	// logPerf('DOM ready.');

	// Modules
	// ---------------------------------------------------------------------------

	// Explanation module scripts
	var expMode = false;

	// Displays explanation popup
	$('.js_pop').hover(
		function() {
			// if ($(this).attr('emmet')) {
			//
			// }
			$(this).next('.exp_pop').show();
		}, function() {
			$(this).next('.exp_pop').hide();
		}
	).mousemove(
		function(event) {
			$(this).next('.exp_pop').css({
				'top': event.pageY - $(this).next('.exp_pop').outerHeight() - 4,
				'left': event.pageX + 8
				// 'left': event.pageX - $(this).offset().left + 8
			});
			// TODO - needs more love
			// console.log(event.pageX);
		}
	);

	// WIP Activates layer with explanation elements
	// Besser ::after oder ::before benutzen
	$('.js_showmeta').click(function(e) {
		var $wrap, $pop;

		if (expMode !== true) {
			expMode = true;

			$('.js_pop').each(function(i, e) {
				if ($(this).css('position') === 'static') {
					$(this).addClass('js_changed_pos');
					$(this).css('position', 'relative');
				}

				$pop = $(this).next('.exp_pop').detach();
				$wrap = $(this).wrap('<span class="exp_wrap"></span>').parent().prepend('<span class="exp_marker_pop"></span>');
				$wrap.after($pop);
			});

		} else {
			$('.js_pop').each(function(i, e) {
				$wrap = $(this).parent('.exp_wrap');
				$pop = $wrap.next('.exp_pop').detach();
				$wrap.find('.exp_marker_pop').remove();
				$(this).unwrap('.exp_wrap');
				$(this).after($pop);
				if ($(this).hasClass('js_changed_pos')) {
					$(this).css('position', '');
					if ($(this).attr('style') === '') {
						$(this).removeAttr('style');
					}
					$(this).removeClass('js_changed_pos');
				}
			});

			expMode = false;

		}
		console.log('Explanation mode', expMode);
	});

	$('#gameIcon').click(function(event) {
		event.preventDefault();
		$(this).clone().appendTo('#gameDetail');
		$(this).siblings().clone().appendTo('#gameDetail');
		$('#gameDetail').removeClass('magic');
	});
});
