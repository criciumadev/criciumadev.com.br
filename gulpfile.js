const gulp = require("gulp");
const jshint = require("gulp-jshint");
const surge = require("gulp-surge");
const babel = require("gulp-babel");
const watch = require("gulp-watch");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const concat = require("gulp-concat");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass");
const del = require("del");
const cssmin = require("gulp-clean-css");
const bulkSass = require("gulp-sass-bulk-import");
const browserSync = require("browser-sync");
const reload = browserSync.reload;

const PATH = {
  dest: "./www",
  src: "./src",
  data: "./src/assets/data",
  css: "./src/assets/stylesheets",
  js: "./src/assets/javascripts",
  templates: "./src/templates",
  node_modules: "./node_modules"
};

const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

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

function getDaysDiff(date) {
  var currentDate = new Date();
  var compareDate = new Date(date.split("T")[0] + "T03:00:01");
  var dateDiff = currentDate.getTime() - compareDate.getTime();

  return Math.floor(dateDiff / ONE_DAY);
}

function appendCompanyAlias(job) {
  var nameSplited = job.company_name.split(" ");
  var firstLetter = nameSplited[0][0];
  var lastLetter = nameSplited[1] ? nameSplited[1][0] : nameSplited[0][1];

  job.alias = (firstLetter + lastLetter).toUpperCase();

  return job;
}

function sortDate(a, b) {
  var da = new Date(!!a.date ? a.date : null).getTime();
  var db = new Date(!!b.date ? b.date : null).getTime();

  if (da < db) {
    return 1;
  }

  if (da > db) {
    return -1;
  }

  return 0;
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
    .src([
      PATH.js + "/slick.js",
      PATH.js + "/jquery.validate.js",
      PATH.js + "/widgets.js",
      PATH.js + "/smtp.js",
      PATH.js + "/custom.js"
    ])
    .pipe(concat("all.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(PATH.dest + "/assets"));
});

gulp.task("clean-html", function() {
  return del(PATH.dest + "/*.html");
});

gulp.task("copy-data", function() {
  return gulp.src(PATH.data + "/*").pipe(gulp.dest(PATH.dest + "/assets/data"));
});

gulp.task(
  "copy-images",
  gulp.series(
    () => gulp.src(PATH.src + "/assets/icons/*").pipe(gulp.dest(PATH.dest + "/assets/icons")),
    () => gulp.src(PATH.src + "/assets/images/*").pipe(gulp.dest(PATH.dest + "/assets/images")),
    () => gulp.src(PATH.src + "/assets/images/**/").pipe(gulp.dest(PATH.dest + "/assets/images")),
    () => gulp.src(PATH.src + "/assets/images/**/*").pipe(gulp.dest(PATH.dest + "/assets/images"))
  )
);

gulp.task("includes-html", function() {
  return gulp
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
                vagas
                  .filter(function(job) {
                    return !!job.date && getDaysDiff(job.date) <= 40 && !!job.featured;
                  })
                  .sort(sortDate)
              ),
              jobs: JSON.stringify(
                vagas
                  .filter(function(job) {
                    return !!job.date && getDaysDiff(job.date) <= 20 && !job.featured;
                  })
                  .sort(sortDate)
              )
            }
          }
        });
      })()
    )
    .pipe(gulp.dest(PATH.dest));
});

gulp.task("minify-html", function() {
  return gulp
    .src(PATH.dest + "/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true
      })
    )
    .pipe(gulp.dest(PATH.dest));
});

gulp.task("generate-html", gulp.series("clean-html", "includes-html", "minify-html"));

gulp.task("webserver", function() {
  browserSync({
    port: 8000,
    server: {
      baseDir: PATH.dest
    }
  });

  gulp.watch(PATH.css + "/**/*.scss", gulp.series("sass-minify")).on("change", reload);
  gulp.watch(PATH.js + "/**/*.js", gulp.series("js-minify")).on("change", reload);
  gulp
    .watch(
      [PATH.templates + "/*.html", PATH.templates + "/**/*.html", PATH.data + "/*.json"],
      gulp.series("generate-html")
    )
    .on("change", reload);
  gulp.watch([PATH.templates + "/assets/icons/*", PATH.templates + "/assets/images/*"], gulp.series("copy-images")),
    gulp.watch(PATH.data + "/*", gulp.series("copy-data")).on("change", reload);
});

gulp.task("build", gulp.series("sass-minify", "copy-images", "js-minify", "generate-html", "copy-data"));

gulp.task("default", gulp.series("sass-minify", "copy-images", "js-minify", "generate-html", "copy-data", "webserver"));

gulp.task("deploy", function() {
  return surge({
    project: "www", // Path to your static build directory
    domain: "criciumadev.com.br" // Your domain or Surge subdomain
  });
});
