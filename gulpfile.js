var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    babel       = require('gulp-babel'),
    watch       = require('gulp-watch'),
    uglify      = require('gulp-uglify'),
    htmlmin     = require('gulp-htmlmin'),
    runSequence = require('run-sequence'),
    concat      = require('gulp-concat'),
    fileinclude = require('gulp-file-include'),
    sass        = require('gulp-sass'),
    del         = require('del'),
    cssmin      = require('gulp-clean-css'),
    bulkSass    = require('gulp-sass-bulk-import'),
    webserver   = require('gulp-webserver');

var PATH = {
  dest:      './www',
  src:       './src',
  css:       './src/assets/stylesheets',
  js:        './src/assets/javascripts',
  templates: './src/templates'
}

gulp.task('sass-minify', function () {
    return gulp.src([
      PATH.css + '/index.scss'
    ])
    .pipe(bulkSass())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest(PATH.dest + '/assets'));
});

gulp.task('js-minify', function () {
  return gulp.src([
    PATH.js + '/respond.min.js',
    PATH.js + '/lazy-loading.js',
    PATH.js + '/jquery.validate.js',
    PATH.js + '/sharer.js',
    PATH.js + '/moment.min.js',
    PATH.js + '/widgets.js',
    PATH.js + '/slick.js',
    PATH.js + '/custom.js'
  ])
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(PATH.dest + '/assets'));
});

gulp.task('clean-html', function() {
  del(PATH.dest + '/*.html');
});

gulp.task('copy-images', function() {
  gulp.src(PATH.src + '/assets/icons/*').pipe(gulp.dest(PATH.dest + '/assets/icons'));
  gulp.src(PATH.src + '/assets/images/*').pipe(gulp.dest(PATH.dest + '/assets/images'));
  gulp.src(PATH.src + '/assets/images/**/').pipe(gulp.dest(PATH.dest + '/assets/images'));
  gulp.src(PATH.src + '/assets/images/**/*').pipe(gulp.dest(PATH.dest + '/assets/images'));
});

gulp.task('includes-html', function() {
  gulp.src(PATH.templates + '/*.html').pipe(fileinclude({
    prefix: '@@'
  })).pipe(gulp.dest(PATH.dest));
  // gulp.src(PATH.templates + '/.htaccess').pipe(gulp.dest(PATH.dest));
});

gulp.task('minify-html', function () {
  // Timeout
  setTimeout(function () {
    gulp.src(PATH.dest + '/*.html').pipe(htmlmin({
      collapseWhitespace: true
    })).pipe(gulp.dest(PATH.dest));
  }, 2000);
});

gulp.task('generate-html', function() {
  runSequence(['clean-html'], ['includes-html'], ['minify-html']);
});

gulp.task('watchs', function () {
  gulp.watch(PATH.css + '/**/*.scss', ['sass-minify']);
  gulp.watch(PATH.js + '/**/*.js', ['js-minify']);
  gulp.watch([PATH.templates + '/*.html', PATH.templates + '/**/*.html'], ['generate-html']);
  gulp.watch([PATH.templates + '/assets/icons/*', PATH.templates + '/assets/images/*'], ['copy-images']);
});

gulp.task('default', function () {
  return runSequence(
    ['sass-minify'],
    ['copy-images'],
    ['js-minify'],
    ['generate-html'],
    ['watchs'],
    ['webserver']
  );
});

gulp.task('webserver', function() {
  gulp.src(PATH.dest)
    .pipe(webserver({
      livereload: true,
      port: 8000
    }));
});