$(function() {

  $('*[data-share=facebook]').on('click', function(e) {
    e.preventDefault();
    $(window).width();
    shareUrl = $(this).attr('data-url');
    left = ($(window).width() / 2) - 200;
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '', '_blank', 'width=400,height=214,left=' + left + ',top=300,resizable=no');
    return false;
  });

  $('*[data-share=twitter]').on('click', function(e) {
    e.preventDefault();
    $(window).width();
    shareUrl = $(this).attr('data-url');
    shareTitle = $(this).attr('data-title');
    left = ($(window).width() / 2) - 250;
    window.open('https://twitter.com/intent/tweet/?text=' + shareTitle + '!&url=' + shareUrl + '', '_blank', 'width=500,height=415,left=' + left + ',top=300,resizable=no');
    return false;
  });

  $('*[data-share=googleplus]').on('click', function(e) {
    e.preventDefault();
    $(window).width();
    shareUrl = $(this).attr('data-url');
    left = ($(window).width() / 2) - 250;
    window.open('https://plus.google.com/share?url=' + shareUrl + '', '_blank', 'width=500,height=415,left=' + left + ',top=300,resizable=no');
    return false;
  });

  $('*[data-share=linkedin]').on('click', function(e) {
    e.preventDefault();
    $(window).width();
    shareUrl = $(this).attr('data-url');
    left = ($(window).width() / 2) - 250;
    window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + shareUrl + '', '_blank', 'width=500,height=415,left=' + left + ',top=300,resizable=no');
    return false;
  });

  $('*[data-share=tumblr]').on('click', function(e) {
    e.preventDefault();
    $(window).width();
    shareUrl = $(this).attr('data-url');
    shareContent = $(this).attr('data-content');
    shareTitle = $(this).attr('data-title');
    left = ($(window).width() / 2) - 250;
    window.open('http://tumblr.com/widgets/share/tool?canonicalUrl=' + shareUrl + '%2F&content=' + shareContent + '%2F&posttype=link&title=' + shareTitle + '', '_blank', 'width=500,height=415,left=' + left + ',top=300,resizable=no');
    return false;
  });

  $('*[data-share=reddit]').on('click', function(e) {
    e.preventDefault();
    $(window).width();
    shareUrl = $(this).attr('data-url');
    left = ($(window).width() / 2) - 250;
    window.open('https://www.reddit.com/submit?url=' + shareUrl + '', '_blank', 'width=500,height=415,left=' + left + ',top=300,resizable=no');
    return false;
  });

});