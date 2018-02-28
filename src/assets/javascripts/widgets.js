window.Widgets = {};

Widgets.eventsFeed = {

    resultsLoader: '*[data-scope="events-feed"]:first',

    eventsUrl: function () {
        return 'https://graph.facebook.com/v2.11/824945717539209?fields=events.limit(10){id,name,place,start_time,cover}&access_token=129540077745238|2Gxb6NU-MpL6iha_lkRBMEsDI9o';
    },

    fetch: function() {
        return $.ajax({
            url: Widgets.eventsFeed.eventsUrl(),
            type: 'GET',
            dataType: 'json',
            beforeSend: function(){
                $(Widgets.eventsFeed.resultsLoader).addClass('loading-content');
            },
            success: function(data) {

                Widgets.eventsFeed.proccessResponse(data);

                setTimeout(function(){
                    SITE.sliderEvents();
                }, 100);
            },
            error: function(error) {
                var resultsLoader, div;
                resultsLoader = $(Widgets.eventsFeed.resultsLoader);
                resultsLoader.html('<div class="list-cards"></div>');
                div = resultsLoader.find('.list-cards');
                return div.append(Widgets.eventsFeed.failureMsg());
            },
            complete: function() {
                setTimeout(function(){
                    $(Widgets.eventsFeed.resultsLoader).removeClass('loading-content');
                }, 1000);
            }
        });
    },

    proccessResponse: function(resp) {

        var results, resultsLoader, div,
            listEvents = resp.events.data;

        resultsLoader = $(Widgets.eventsFeed.resultsLoader);
        resultsLoader.html("<div class='list-cards'></div>");
        div = resultsLoader.find('.list-cards');

        if (listEvents.length) {
            results = [];

            for (i in listEvents) {
                var event = listEvents[i];
                results.push(div.append(Widgets.eventsFeed.buildEntryHTML(event)));
            }

            return results;
        } else {
            return div.append(Widgets.eventsFeed.failureMsg());
        }
    },

    failureMsg: function() {
        return '<div class="empty">Ocorreu um erro ao carregar o conteúdo.</div>';
    },

    dateStatus: function(eventDate) {
        var isBefore = moment(eventDate).isBefore(moment(), 'day');

        if (isBefore) {
            return 'old-event';
        } else {
            return  'future-event'
        }
    },

    buildEntryHTML: function(event) {
        var date = event.start_time,
            html, dateStatus;

        dateStatus = Widgets.eventsFeed.dateStatus(date);

        return html = '<div class="card ' + dateStatus + '">\
            <a target="_blank" href="https://www.facebook.com/events/' + event.id + '" title="' + event.name + '">\
                <div class="card-image" style="background-image: url(' + event.cover.source + ');"></div>\
                <div class="card-content">\
                    <h6 class="card-title">' + event.name + '</h6>\
                    <p class="card-detail">' + moment(date).format('DD/MM/YYYY - HH:mm') + 'hs na ' + event.place.name + '</p>\
                    <span class="card-link">Ver mais <i class="icon-arrow-right"></i></span>\
                </div>\
            </a>\
        </div>';
    }
};

Widgets.postsFeed = {

    resultsLoader: '*[data-scope="posts-feed"]:first',

    postsUrl: function() {
        return 'https://exec.clay.run/mateusw3c/medium-get-users-posts-fork?username=criciumadev';
    },

    fetch: function() {
        return $.ajax({
            url: Widgets.postsFeed.postsUrl(),
            type: 'GET',
            dataType: 'json',
            beforeSend: function(){
                $(Widgets.postsFeed.resultsLoader).addClass('loading-content');
            },
            success: function(data) {
                Widgets.postsFeed.proccessResponse(data);
            },
            error: function(error) {
                var resultsLoader, div;
                resultsLoader = $(Widgets.postsFeed.resultsLoader);
                resultsLoader.html('<div class="list-posts"></div>');
                div = resultsLoader.find('.list-posts');
                return div.append(Widgets.postsFeed.failureMsg());
            },
            complete: function() {
                setTimeout(function(){
                    $(Widgets.postsFeed.resultsLoader).removeClass('loading-content');
                }, 1000);
            }
        });
    },

    proccessResponse: function(resp) {

        var results, resultsLoader, div,
            listPosts = resp.payload.posts;

        resultsLoader = $(Widgets.postsFeed.resultsLoader);
        resultsLoader.html("<div class='list-posts row'></div>");
        div = resultsLoader.find('.list-posts');

        if (listPosts.length) {
            results = [];

            for (i in listPosts) {
                if (i > 2) { break; }
                results.push(div.append(Widgets.postsFeed.buildEntryHTML(listPosts[i])));
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
        var gridClass = (i == 0 ? 'col-md-8 col-sm-8 col-xs-12' : 'col-md-4 col-sm-4 col-xs-12'),
            postArticle = (i == 0 ? 'recent-article' : ''),
            imageSize = (i == 0 ? 'max/800' : 'fit/t/700/394'),
            html;

        // console.log(i);

        html = '<div class="' + gridClass + '">';

        html += '<article class="article '+ postArticle +'">\
            <a target="_blank" href="https://medium.com/criciumadev/' + post.uniqueSlug + '" title="' + post.title + '">\
                <div class="article-image" style="background-image: url(https://cdn-images-1.medium.com/' + imageSize + '/' + post.virtuals.previewImage.imageId + ');"></div>\
                <h3>' + post.title + '</h3>\
                <p>' + post.virtuals.subtitle + '</p>\
            </a>\
        </article>';

        html += '</div>';

        return html;
    }
};

Widgets.videosFeed = {

    resultsLoader: '*[data-scope="videos-feed"]:first',
    
    videosUrl: function() {
        return 'https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=3&type=video&channelId=UC5rQV1_PbC_hYxaiT78lbhg&order=date&key=AIzaSyCZmY81f-SWAOLFBKv8fjgUVW9gOK0IzJs';
    },

    fetch: function() {
        return $.ajax({
            url: Widgets.videosFeed.videosUrl(),
            type: 'GET',
            dataType: 'json',
            beforeSend: function(){
                $(Widgets.videosFeed.resultsLoader).addClass('loading-content');
            },
            success: function(data) {
                Widgets.videosFeed.proccessResponse(data);
            },
            error: function(error) {
                var resultsLoader, div;
                resultsLoader = $(Widgets.videosFeed.resultsLoader);
                resultsLoader.html('<div class="list-videos"></div>');
                div = resultsLoader.find('.list-videos');
                return div.append(Widgets.videosFeed.failureMsg());
            },
            complete: function() {
                setTimeout(function(){
                    $(Widgets.videosFeed.resultsLoader).removeClass('loading-content');
                }, 1000);
            }
        });
    },

    proccessResponse: function(resp) {

        var results, resultsLoader, div,
            listVideos = resp.items;

        resultsLoader = $(Widgets.videosFeed.resultsLoader);
        resultsLoader.html("<div class='list-videos row'></div>");
        div = resultsLoader.find('.list-videos');

        if (listVideos.length) {
            results = [];

            for (i in listVideos) {
                var video = listVideos[i];
                results.push(div.append(Widgets.videosFeed.buildEntryHTML(video)));
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

        return html = '<div class="col-md-4 col-sm-4 col-xs-12">\
            <a class="video" target="_blank" href="https://www.youtube.com/watch?v=' + video.id.videoId + '" title="' + video.snippet.title + '">\
                <div class="video-image" style="background-image: url(' + video.snippet.thumbnails.high.url + ');"></div>\
                <div class="video-content">\
                    <h6 class="video-title">' + video.snippet.title + '</h6>\
                </div>\
            </a>\
        </div>';
    }
};