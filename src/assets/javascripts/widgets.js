window.Widgets = {};

Widgets.eventsFeed = {
    resultsLoader: '*[data-scope="events-feed"]:first',

    eventsUrl: function() {
        return "./assets/data/events.json";
    },

    fetch: function() {
        return $.ajax({
            url: Widgets.eventsFeed.eventsUrl(),
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                $(Widgets.eventsFeed.resultsLoader).addClass("loading-content");
            },
            success: function(data) {
                Widgets.eventsFeed.proccessResponse(data);

                setTimeout(function() {
                    SITE.sliderEvents();
                }, 100);
            },
            error: function(error) {
                var resultsLoader, div;
                resultsLoader = $(Widgets.eventsFeed.resultsLoader);
                resultsLoader.html('<div class="list-cards"></div>');
                div = resultsLoader.find(".list-cards");
                return div.append(Widgets.eventsFeed.failureMsg());
            },
            complete: function() {
                setTimeout(function() {
                    $(Widgets.eventsFeed.resultsLoader).removeClass(
                        "loading-content"
                    );
                }, 1000);
            },
        });
    },

    proccessResponse: function(resp) {
        var results,
            resultsLoader,
            div,
            listEvents = resp.events.data;

        resultsLoader = $(Widgets.eventsFeed.resultsLoader);
        resultsLoader.html("<div class='list-cards'></div>");
        div = resultsLoader.find(".list-cards");

        if (listEvents.length) {
            results = [];

            for (i in listEvents) {
                var event = listEvents[i];
                results.push(
                    div.append(Widgets.eventsFeed.buildEntryHTML(event))
                );
            }

            return results;
        } else {
            return div.append(Widgets.eventsFeed.failureMsg());
        }
    },

    failureMsg: function() {
        return '<div class="empty">Ocorreu um erro ao carregar o conteúdo.</div>';
    },

    buildEntryHTML: function(event) {
        var html;

        return (html =
            '<div class="card ' + event.future + '">\
            <a target="_blank" href="' + event.link + '" title="' + event.name + '">\
                <div class="card-image" style="background-image: url(' + event.cover + ');"></div>\
                <div class="card-content">\
                    <h6 class="card-title">' + event.name + '</h6>\
                    <p class="card-detail">' + event.date + ' na ' + event.place + '</p>\
                    <span class="card-link">Ver mais <i class="icon-arrow-right"></i></span>\
                </div>\
            </a>\
        </div>');
    },
};

Widgets.postsFeed = {
    resultsLoader: '*[data-scope="posts-feed"]:first',

    postsUrl: function() {
        return "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/criciumadev";
    },

    fetch: function() {
        return $.ajax({
            url: Widgets.postsFeed.postsUrl(),
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                $(Widgets.postsFeed.resultsLoader).addClass("loading-content");
            },
            success: function(data) {
                Widgets.postsFeed.proccessResponse(data);
            },
            error: function(error) {
                var resultsLoader, div;
                resultsLoader = $(Widgets.postsFeed.resultsLoader);
                resultsLoader.html('<div class="list-posts"></div>');
                div = resultsLoader.find(".list-posts");
                return div.append(Widgets.postsFeed.failureMsg());
            },
            complete: function() {
                setTimeout(function() {
                    $(Widgets.postsFeed.resultsLoader).removeClass(
                        "loading-content"
                    );
                }, 1000);
            },
        });
    },

    proccessResponse: function(resp) {
        var results,
            resultsLoader,
            div;
            listPosts = resp.items;

        resultsLoader = $(Widgets.postsFeed.resultsLoader);
        resultsLoader.html("<div class='list-posts row'></div>");
        div = resultsLoader.find(".list-posts");

        if (listPosts.length) {
            results = [];

            for (i in listPosts) {
                if (i > 2) {
                    break;
                }
                results.push(
                    div.append(Widgets.postsFeed.buildEntryHTML(listPosts[i]))
                );
            }

            return results;
        } else {
            return div.append(Widgets.postsFeed.failureMsg());
        }
    },

    failureMsg: function() {
        return '<li class="empty">Ocorreu um erro ao carregar o conteúdo.</li>';
    },

    buildEntryHTML: function(post) {
        var gridClass =
                i == 0
                    ? "col-md-8 col-sm-12 col-xs-12"
                    : "col-md-4 col-sm-12 col-xs-12",
            postArticle = i == 0 ? "recent-article" : "",
            html;

        html = '<div class="' + gridClass + '">';

        html += '<article class="article ' + postArticle + '">\
            <a target="_blank" href="' + post.link + '" title="' + post.title + '">\
                <div class="article-image" style="background-image: url(' + post.thumbnail + ');"></div>\
                <h3>' + post.title + "</h3>\
                <p></p>\
            </a>\
        </article>";

        html += "</div>";

        return html;
    },
};

Widgets.videosFeed = {
    resultsLoader: '*[data-scope="videos-feed"]:first',

    videosUrl: function() {
        return "https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=3&type=video&channelId=UC5rQV1_PbC_hYxaiT78lbhg&order=date&key=AIzaSyC_TkjxfYtTznq3PLLZlSEOG04vCdAmnoA";
    },

    fetch: function() {
        return $.ajax({
            url: Widgets.videosFeed.videosUrl(),
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                $(Widgets.videosFeed.resultsLoader).addClass("loading-content");
            },
            success: function(data) {
                Widgets.videosFeed.proccessResponse(data);
            },
            error: function(error) {
                var resultsLoader, div;
                resultsLoader = $(Widgets.videosFeed.resultsLoader);
                resultsLoader.html('<div class="list-videos"></div>');
                div = resultsLoader.find(".list-videos");
                return div.append(Widgets.videosFeed.failureMsg());
            },
            complete: function() {
                setTimeout(function() {
                    $(Widgets.videosFeed.resultsLoader).removeClass(
                        "loading-content"
                    );
                }, 1000);
            },
        });
    },

    proccessResponse: function(resp) {
        var results,
            resultsLoader,
            div,
            listVideos = resp.items;

        resultsLoader = $(Widgets.videosFeed.resultsLoader);
        resultsLoader.html("<div class='list-videos row'></div>");
        div = resultsLoader.find(".list-videos");

        if (listVideos.length) {
            results = [];

            for (i in listVideos) {
                var video = listVideos[i];
                results.push(
                    div.append(Widgets.videosFeed.buildEntryHTML(video))
                );
            }

            return results;
        } else {
            return div.append(Widgets.videosFeed.failureMsg());
        }
    },

    failureMsg: function() {
        return '<div class="empty">Ocorreu um erro ao carregar o conteúdo.</div>';
    },

    buildEntryHTML: function(video) {
        var html;

        return (html =
            '<div class="col-md-4 col-sm-4 col-xs-12">\
            <a class="video" target="_blank" href="https://www.youtube.com/watch?v=' +
            video.id.videoId +
            '" title="' +
            video.snippet.title +
            '">\
                <div class="video-image" style="background-image: url(' +
            video.snippet.thumbnails.high.url +
            ');"></div>\
                <div class="video-content">\
                    <h6 class="video-title">' +
            video.snippet.title +
            "</h6>\
                </div>\
            </a>\
        </div>");
    },
};

Widgets.jobs = {
    errorMessage: "Ocorreu um erro ao carregar o conteúdo.",

    jobsUrl: function() {
        return "./assets/data/jobs.json";
    },

    fetch: function(success) {
        return $.ajax({
            url: Widgets.jobs.jobsUrl(),
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                //start loading
            },
            error: function(error) {
                return Widgets.jobs.errorMessage;
            },
        });
    },
};
