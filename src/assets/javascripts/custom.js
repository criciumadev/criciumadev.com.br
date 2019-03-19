var SITE = SITE || {};

var ONE_SECOND = 1000;
var ONE_MINUTE = ONE_SECOND * 60;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24;

var CDC_DATE = "2019-05-04T08:00:00.180Z";

function dateFmt(date) {
	return (
		[date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/") +
		" " +
		[date.getHours(), date.getMinutes()].join(":")
	);
}

function complexDateDiff(date) {
	var compareDate = new Date(date);
	var currentDate = new Date();

	var dateDiff = compareDate.getTime() - currentDate.getTime();

	var days = Math.floor(dateDiff / ONE_DAY);
	var daysDiff = dateDiff - days * ONE_DAY;

	var hours = Math.floor(daysDiff / ONE_HOUR);
	var hoursDiff = daysDiff - hours * ONE_HOUR;

	var minutes = Math.floor(hoursDiff / ONE_MINUTE);
	var minutesDiff = hoursDiff - minutes * ONE_MINUTE;

	var seconds = Math.floor(minutesDiff / ONE_SECOND);

	return {
		days: Math.max(days, 0),
		hours: Math.max(hours, 0),
		minutes: Math.max(minutes, 0),
		seconds: Math.max(seconds, 0)
	};
}

function daysDiff(date) {
	var currentDate = new Date();
	var compareDate = new Date(date.split("T")[0] + "T03:00:01");
	var dateDiff = currentDate.getTime() - compareDate.getTime();

	return Math.floor(dateDiff / ONE_DAY);
}

function friendlyDate(date) {
	var diff = daysDiff(date);
	if (diff < 0) {
		return "AGORA";
	}

	if (diff === 0) {
		return "HOJE";
	}

	if (diff === 1) {
		return "ONTEM";
	}

	return "HÁ " + diff + " DIAS";
}

SITE.init = function() {
	this.sliderEvents();
	this.goToTop();
	this.menuActive();
	this.newsletter();
	this.sendMail();

	/* HOME */
	if ($(document.body).hasClass("page-home")) {
		// Widgets.eventsFeed.fetch();
		Widgets.postsFeed.fetch();
		Widgets.videosFeed.fetch();
	}

	/* VAGAS */
	if ($(document.body).hasClass("page-vagas")) {
		this.vagas();
	}

	/* CONFERENCE */
	if ($(document.body).hasClass("page-conference-2019")) {
		this.conferenceCountdown();
	}
};

SITE.conferenceCountdown = function() {
	var countdown = $(".box-1 .countdown");

	function tickCounters() {
		var diff = complexDateDiff(CDC_DATE);
		countdown.find(".countdown-item__days > .countdown-item--tag").text(diff.days);
		countdown.find(".countdown-item__hours > .countdown-item--tag").text(diff.hours);
		countdown.find(".countdown-item__minutes > .countdown-item--tag").text(diff.minutes);

		setTimeout(tickCounters.bind(this), 1000);
	}

	tickCounters();
};

SITE.vagas = function() {
	$(".page-vagas .list-jobs li").each(function(i) {
		var spanDate = $("span[data-date]", this);
		spanDate.text(friendlyDate(spanDate.data("date")));
	});

	$(".page-vagas .list-jobs-featured li").each(function(i) {
		var spanDate = $("span[data-date]", this);
		var diff = daysDiff(spanDate.data("date"));
		if (diff > 40) {
			spanDate.parents("li").hide();
		}
	});

	$(".page-vagas .list-jobs-other li").each(function(i) {
		var spanDate = $("span[data-date]", this);
		var diff = daysDiff(spanDate.data("date"));
		if (diff > 20) {
			spanDate.parents("li").hide();
		}
	});
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
					slidesToShow: 2
				}
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 1
				}
			}
		]
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
				email: true
			}
		},
		messages: {
			EMAIL: {
				required: "Email é obrigatório",
				email: "Insira um email válido"
			}
		}
	});

	$form.on("submit", function(e) {
		e.preventDefault();

		$message.hide();

		if ($form.valid()) {
			$button.val("Enviando...");

			var params = {
				email: $("#email").val(),
				list: $("#list").val(),
				boolean: "true"
			};

			$.ajax({
				type: "POST",
				url: $form.attr("action"),
				data: params,
				complete: function(data) {
					$button.val("Assinar");
					$message.text("Cadastrado com sucesso!").show();
					$form[0].reset();
				}
			});

			return;
		}
	});
};

SITE.sendMail = function() {
	var $form = $('*[data-scope="contact-form"]:first');
	$button = $('*[data-item="button"]:first', $form);

	$form.validate({
		rules: {
			nome: {
				required: true
			},
			email: {
				required: true
			},
			assunto: {
				required: true
			},
			mensagem: {
				required: true
			}
		},
		messages: {
			nome: {
				required: "Nome é obrigatório"
			},
			email: {
				required: "E-mail é obrigatório",
				email: "Insira um email válido"
			},
			assunto: {
				required: "Assunto é obrigatório"
			},
			mensagem: {
				required: "Mensagem é obrigatória"
			}
		}
	});

	$form.on("submit", function(e) {
		e.preventDefault();

		var $type = $('*[data-item="type"]:first', $form).val();

		if ($type == "vaga") {
			var $params = {
				subject: "Publicação de vaga",
				titulo: $('*[data-item="titulo"]:first', $form).val(),
				empresa: $('*[data-item="empresa"]:first', $form).val(),
				link: $('*[data-item="link"]:first', $form).val(),
				tipo: $('*[data-item="tipo"]:first', $form).val(),
				cidade: $('*[data-item="cidade"]:first', $form).val()
			};

			var $message =
				'\
				<div style="font: 15px/25px Arial;">\
					<strong>Título: </strong> ' +
				$params.titulo +
				"<br>\
					<strong>Empresa: </strong> " +
				$params.empresa +
				"<br>\
					<strong>Link: </strong> " +
				$params.link +
				"<br>\
					<strong>Tipo: </strong> " +
				$params.tipo +
				"<br>\
					<strong>Cidade: </strong> " +
				$params.cidade +
				"<br>\
				</div>\
			";
		} else {
			var $params = {
				subject: "Contato vindo do Site",
				nome: $('*[data-item="nome"]:first', $form).val(),
				email: $('*[data-item="email"]:first', $form).val(),
				assunto: $('*[data-item="assunto"]:first', $form).val(),
				mensagem: $('*[data-item="mensagem"]:first', $form).val()
			};

			var $message =
				'\
				<div style="font: 15px/25px Arial;">\
					<strong>Nome: </strong> ' +
				$params.nome +
				"<br>\
					<strong>Email: </strong> " +
				$params.email +
				"<br>\
					<strong>Assunto: </strong> " +
				$params.assunto +
				"<br>\
					<strong>Mensagem: </strong> " +
				$params.mensagem +
				"<br>\
				</div>\
			";
		}

		if ($form.valid()) {
			Email.send(
				"contato@criciumadev.com.br", // From
				"contato@criciumadev.com.br", // To
				$params.subject, // Subject
				$message, // Body
				{
					token: "8b79454e-0360-4823-bd29-436a76100893",
					callback: function done(message) {
						if (message === "OK") {
							alert("Email enviado! Agradecemos seu contato ;)");
							$form[0].reset();
						} else {
							alert("Ocorreu um problema ao enviar o email. Entre em contato por nossa página do Facebook!");
						}
					}
				}
			);
		}
	});
};

$(document).ready(function() {
	SITE.init();
});
