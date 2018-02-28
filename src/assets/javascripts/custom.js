var SITE = SITE || {};

$(document).ready(function() {
	SITE.init();
});

$(window).resize(function() {
});

SITE.init = function() {
	this.sliderEvents();
	this.goToTop();
	this.menuActive();
};

SITE.sliderEvents = function() {

	var $scope = $('*[data-scope="events-feed"]:first').find('.list-cards');
	var $scopeArrows = $('*[data-scope="events-feed-arrows"]:first');

	$scope.slick({
		dots: false,
		speed: 200,
		arrows: true,
		infinite: true,
		draggable: true,
		slidesToShow: 3,
		centerMode: true,
		slidesToScroll: 1,
		prevArrow: $('*[data-arrow="slider-events-prev"]:first', $scopeArrows),
		nextArrow: $('*[data-arrow="slider-events-next"]:first', $scopeArrows)
	});

};

SITE.goToTop = function() {
	$('*[data-scope="go-to-top"]:first').on('click', function() {
		$('body,html').animate({ scrollTop : 0 }, 500);
	});
}

SITE.menuActive = function() {
	var $scope = $('*[data-scope=header]:first');
	$('a[href^="/' + location.pathname[1] + '"]', $scope).addClass('active');
}