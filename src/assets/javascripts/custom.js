var SITE = SITE || {};

var ONE_MINUTE = 1000 * 60;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24;

var CDC_DATE = "2018-05-19 08:00:00";

function dateFmt(date) {
	return (
		[date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/") +
		" " +
		[date.getHours(), date.getMinutes()].join(":")
	);
}

function getDaysDiff(date) {
	var currentDate = new Date();
	var compareDate = new Date(date.split("T")[0] + "T03:00:01.311Z");
	var dateDiff = currentDate.getTime() - compareDate.getTime();

	return Math.floor(dateDiff / ONE_DAY);
}

function friendlyDate(date) {
	var daysDiff = getDaysDiff(date);
	if (daysDiff < 0) {
		return "AGORA";
	}

	if (daysDiff === 0) {
		return "HOJE";
	}

	if (daysDiff === 1) {
		return "ONTEM";
	}

	return "HÁ " + daysDiff + " DIAS";
}

SITE.init = function() {
	this.sliderEvents();
	this.goToTop();
	this.menuActive();
	this.newsletter();

	/* HOME */
	if ($(document.body).hasClass("page-home")) {
		// Widgets.eventsFeed.fetch();
		Widgets.postsFeed.fetch();
		Widgets.videosFeed.fetch();
	}

	/* VAGAS */
	if ($(document.body).hasClass("page-vagas")) {
		$(".page-vagas .list-jobs li").each(function(i) {
			var spanDate = $("span[data-date]", this);
			spanDate.text(friendlyDate(spanDate.data("date")));
		});

		$(".page-vagas .list-jobs-featured li").each(function(i) {
			var spanDate = $("span[data-date]", this);
			var daysDiff = getDaysDiff(spanDate.data("date"));
			if (daysDiff > 40) {
				spanDate.parents("li").hide();
			}
		});

		$(".page-vagas .list-jobs-other li").each(function(i) {
			var spanDate = $("span[data-date]", this);
			var daysDiff = getDaysDiff(spanDate.data("date"));
			if (daysDiff > 20) {
				spanDate.parents("li").hide();
			}
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
	var currentUrl = $(document.body).data("url");
	var $scope = $("*[data-scope=header]:first");
	$(".list-menu a[href]", $scope).each(function() {
		if (currentUrl === $(this).attr("href")) {
			$(this).addClass("active");
		}
	});
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

$(document).ready(function() {
	SITE.init();
});
