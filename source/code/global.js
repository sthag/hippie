'use strict';

// DOM ready
// ------------------------------------------------------------------------------
$( document ).ready(function() {

	// Setup
	// ------------------------------------------------------------------------------

	setup();



	// Modules
	// ------------------------------------------------------------------------------

	// Explanation module scripts
	var exp_mode = false;

	// Displays explanation popup
	$(".js_pop").hover(
		function() {
			var $this = $(this);

			if($(this).attr("emmet")){

			}

			$(this).next(".exp_pop").show();
		}, function() {
			$(this).next(".exp_pop").hide();
		}
	).mousemove(
		function(ev) {
			$(this).next(".exp_pop").css({
				"top": ev.pageY - $(this).next(".exp_pop").outerHeight() - 4,
				"left": ev.pageX + 8
				// "left": ev.pageX - $(this).offset().left + 8
			});
			// TODO - needs more love
			console.log(ev.pageX);
		}
	);

	// WIP Activates layer with explanation elements
	// Besser ::after oder ::before benutzen
	$(".exp_help_btn").click(function(e){
		var $wrap, $pop;

		if(exp_mode != true){
			exp_mode = true;

			$(".js_pop").each(function(i, e){
				if($(this).css("position") == "static") {
					$(this).addClass("js_changed_pos");
					$(this).css("position", "relative");
				}

				$pop = $(this).next(".exp_pop").detach();
				$wrap = $(this).wrap("<span class=\"exp_wrap\"></span>").parent().prepend("<span class=\"exp_marker_pop\"></span>");
				$wrap.after($pop);
			});

		} else {
			$(".js_pop").each(function(i, e){
				$wrap = $(this).parent(".exp_wrap");
				$pop = $wrap.next(".exp_pop").detach();
				$wrap.find(".exp_marker_pop").remove();
				$(this).unwrap(".exp_wrap");
				$(this).after($pop);
				if($(this).hasClass("js_changed_pos")){
					$(this).css("position", "");
					if($(this).attr("style") == "") {
						$(this).removeAttr("style");
					}
					$(this).removeClass("js_changed_pos");
				}
			});

			exp_mode = false;

		}
		console.log("Explanation mode: "+ exp_mode);
	});

	//	WIP Scroll to top
	$('#js_scrolltop').click(function(event) {
		console.log('scroll to the top');
		event.preventDefault();
		// $('body').scrollTop();
		$('body').animate({scrollTop: 0}, basic_ease, function() {
			 console.log('arrived at top');
		});
	});
	$('#js_scrolldown').click(function(event) {
		console.log('scroll down');
		event.preventDefault();
		$('body').animate({scrollTop: $(document).height()}, basic_ease * 2, function() {
			 console.log('arrived at bottom');
		});
	});



	$( "#gameIcon" ).click(function(event) {
		event.preventDefault();
		$( this ).clone().appendTo( "#gameDetail" );
		$( this ).siblings().clone().appendTo( "#gameDetail" );
		$( "#gameDetail" ).removeClass( "magic" );
	});

	var i = 0;
	$( ".pass-def dd" ).each(function() {
		$( this ).find( "li" ).each(function( index ) {
			if ( 0 == $( this ).children( "ul" ).length ) {
				//console.log( index + ": " + $( this ).text() );
				var tempContent = $( this ).html();
				//$( this ).html( "<span class=\"list-count\"></span>" );
				$( this ).html( tempContent +"<span class=\"list-count\">"+ i +"</span>" );
				i++;
			}
		})
	});



});



// Scroll
// ------------------------------------------------------------------------------
$( document ).scroll(function() {

	// Toggle navigation elements
	doc_pos_y = $( document ).scrollTop();
	// console.log(doc_pos_y);
	var h = scroll_y_margin;
	// var demo_margin = $('.header__fix');
	if (doc_pos_y > h) {
		$('#js_scrolltop').parent().removeClass('magic');
	} else {
		$('#js_scrolltop').parent().addClass('magic');
	}



});
