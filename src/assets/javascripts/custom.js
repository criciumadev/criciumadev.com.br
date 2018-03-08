var SITE = SITE || {};

$(document).ready(function() {
	SITE.init();
});

$(window).resize(function() {});

function friendlyDate(date) {
	var _date = moment(date);
	var currentDate = moment();
	var isSameYear = _date.year() == currentDate.year();
	var isSameMonth = _date.month() == currentDate.month();

	if (currentDate.date() == _date.date() && isSameYear && isSameMonth) {
		return "HOJE";
	}

	if (currentDate.date() - 1 == _date.date()) {
		return "ONTEM";
	}

	return "HÁ " + _date.date() + " " + (_date.date() > 1 ? "DIAS" : "DIA");
}

SITE.init = function() {
	this.sliderEvents();
	this.goToTop();
	this.menuActive();
	this.newsletter();

	/* HOME */
	if ($(document.body).hasClass("page-home")) {
		Widgets.eventsFeed.fetch();
		Widgets.postsFeed.fetch();
		Widgets.videosFeed.fetch();
	}

	/* VAGAS */
	if ($(document.body).hasClass("page-vagas")) {
		$(".page-vagas .list-jobs li").each(function(i) {
			var spanDate = $("span[data-date]", this);
			spanDate.text(friendlyDate(spanDate.data("date")));
		});
	}
};

SITE.sliderEvents = function() {
	var $scope = $('*[data-scope="events-feed"]:first').find(".list-cards");
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
		nextArrow: $('*[data-arrow="slider-events-next"]:first', $scopeArrows),
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	});
};

SITE.goToTop = function() {
	$('*[data-scope="go-to-top"]:first').on("click", function(e) {
		e.preventDefault();
		$("body,html").animate({ scrollTop: 0 }, 500);
	});
};

SITE.menuActive = function() {
	// var $scope = $('*[data-scope=header]:first');
	// $('a[href^="' + location.pathname + '"]', $scope).addClass('active');
};

SITE.newsletter = function() {
	var $form = $("*[data-scope=newsletter]:first"),
		$input = $("*[data-item=input]:first", $form),
		$button = $("*[data-item=button]:first", $form),
		$message = $("*[data-item=subscribe-result]:first", $form);

	$form.validate({
		rules: {
			EMAIL: {
				required: true,
				email: true,
			},
		},
		messages: {
			EMAIL: {
				required: "Email é obrigatório",
				email: "Insira um email válido",
			},
		},
	});

	$form.on("submit", function(e) {
		e.preventDefault();

		$message.hide();

		if ($form.valid()) {
			$button.val("Enviando...");

			$.ajax({
				type: $form.attr("method"),
				url: $form.attr("action"),
				data: $form.serialize(),
				cache: false,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				error: function(err) {
					$button.val("Assinar");
					$message.text("Ocorreu um erro. Tente novamente.").show();
				},
				success: function(data) {
					$button.val("Assinar");
					if (data.result === "success") {
						$message.text("Cadastrado com sucesso!").show();
					} else {
						$message.text("Ocorreu um erro ou o email já está cadastrado.").show();
					}
				},
			});

			return;
		}
	});
};
