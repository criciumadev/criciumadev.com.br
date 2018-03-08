var gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  babel = require("gulp-babel"),
  watch = require("gulp-watch"),
  uglify = require("gulp-uglify"),
  htmlmin = require("gulp-htmlmin"),
  runSequence = require("run-sequence"),
  concat = require("gulp-concat"),
  fileinclude = require("gulp-file-include"),
  sass = require("gulp-sass"),
  del = require("del"),
  cssmin = require("gulp-clean-css"),
  bulkSass = require("gulp-sass-bulk-import"),
  webserver = require("gulp-webserver");

var PATH = {
  dest: "./www",
  src: "./src",
  data: "./src/assets/data",
  css: "./src/assets/stylesheets",
  js: "./src/assets/javascripts",
  templates: "./src/templates",
  node_modules: "./node_modules",
};

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

function appendCompanyAlias(job) {
  var nameSplited = job.company_name.split(" ");
  var firstLetter = nameSplited[0][0];
  var lastLetter = nameSplited[1] ? nameSplited[1][0] : nameSplited[0][1];

  job.alias = (firstLetter + lastLetter).toUpperCase();

  return job;
}

gulp.task("sass-minify", function() {
  return gulp
    .src([PATH.css + "/index.scss"])
    .pipe(bulkSass())
    .pipe(sass().on("error", sass.logError))
    .pipe(cssmin())
    .pipe(concat("all.min.css"))
    .pipe(gulp.dest(PATH.dest + "/assets"));
});

gulp.task("js-minify", function() {
  return gulp
    .src([PATH.js + "/slick.js", PATH.js + "/jquery.validate.js", PATH.js + "/widgets.js", PATH.js + "/custom.js"])
    .pipe(concat("all.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(PATH.dest + "/assets"));
});

gulp.task("clean-html", function() {
  del(PATH.dest + "/*.html");
});

gulp.task("copy-data", function() {
  gulp.src(PATH.data + "/*").pipe(gulp.dest(PATH.dest + "/assets/data"));
});

gulp.task("copy-images", function() {
  gulp.src(PATH.src + "/assets/icons/*").pipe(gulp.dest(PATH.dest + "/assets/icons"));
  gulp.src(PATH.src + "/assets/images/*").pipe(gulp.dest(PATH.dest + "/assets/images"));
  gulp.src(PATH.src + "/assets/images/**/").pipe(gulp.dest(PATH.dest + "/assets/images"));
  gulp.src(PATH.src + "/assets/images/**/*").pipe(gulp.dest(PATH.dest + "/assets/images"));
});

gulp.task("includes-html", function() {
  gulp
    .src(PATH.templates + "/*.html")
    .pipe(
      (function() {
        requireUncached(PATH.data + "/jobs.json");

        var colors = {};
        var vagas = require(PATH.data + "/jobs.json").map(function(job) {
          job = appendCompanyAlias(job);

          if (!job.color) {
            if (colors[job.company_name]) {
              job.color = colors[job.company_name];
            } else {
              job.color = getRandomColor();
              colors[job.company_name] = job.color;
            }
          }

          return job;
        });

        return fileinclude({
          prefix: "@@",
          context: {
            vagas: {
              featured: JSON.stringify(
                vagas.filter(function(job) {
                  return !!job.featured;
                })
              ),
              jobs: JSON.stringify(
                vagas.filter(function(job) {
                  return !job.featured;
                })
              ),
            },
          },
        });
      })()
    )
    .pipe(gulp.dest(PATH.dest));
});

gulp.task("minify-html", function() {
  // Timeout
  setTimeout(function() {
    gulp
      .src(PATH.dest + "/*.html")
      .pipe(
        htmlmin({
          collapseWhitespace: true,
        })
      )
      .pipe(gulp.dest(PATH.dest));
  }, 2000);
});

gulp.task("generate-html", function() {
  runSequence(["clean-html"], ["includes-html"], ["minify-html"]);
});

gulp.task("watchs", function() {
  gulp.watch(PATH.css + "/**/*.scss", ["sass-minify"]);
  gulp.watch(PATH.js + "/**/*.js", ["js-minify"]);
  gulp.watch([PATH.templates + "/*.html", PATH.templates + "/**/*.html", PATH.data + "/*.json"], ["generate-html"]);
  gulp.watch([PATH.templates + "/assets/icons/*", PATH.templates + "/assets/images/*"], ["copy-images"]);
  gulp.watch(PATH.data + "/*", ["copy-data"]);
});

gulp.task("webserver", function() {
  gulp.src(PATH.dest).pipe(
    webserver({
      livereload: true,
      port: 8000,
    })
  );
});

gulp.task("build", function() {
  return runSequence(["sass-minify"], ["copy-images"], ["js-minify"], ["generate-html"], ["copy-data"]);
});

gulp.task("default", function() {
  return runSequence(
    ["sass-minify"],
    ["copy-images"],
    ["js-minify"],
    ["generate-html"],
    ["copy-data"],
    ["watchs"],
    ["webserver"]
  );
});
