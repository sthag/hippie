"use strict";

function setup() {
	if($('#js_tph').length && full_view_hover) {
		// $('body').prepend("<div id=\"js_tph\" class=\"layer__hover hover_full_view_change\"></div>");
		$('#js_tph').addClass("hover_full_view_change");
	}
}

// get document coordinates of the element
function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

// https://stackoverflow.com/a/488073/1444149
function Utils() {

}

Utils.prototype = {
    constructor: Utils,
    isElementInView: function (element, fullyInView) {
        var pageTop = $(window).scrollTop();
        var pageBottom = pageTop + $(window).height();
        var elementTop = $(element).offset().top;
        var elementBottom = elementTop + $(element).height();

        if (fullyInView === true) {
            return ((pageTop < elementTop) && (pageBottom > elementBottom));
        } else {
            return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
        }
    }
};

var Utils = new Utils();

// TEST

function scrollNav() {
	$('.nav a').click(function(){
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
