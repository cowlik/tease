var gulp = require("gulp"),
    cssNano = require("cssnano"),
    del = require("del"),
    postCSS = require("gulp-postcss"),
    rename = require("gulp-rename"),
    shell = require("gulp-shell"),
    uglify = require("gulp-uglify"),
    vinylPaths = require("vinyl-paths");

gulp.task("minify:css", function() {
    var processors = [cssNano({ autoprefixer: false, discardUnused: false, zindex: false })];
    return gulp.src("www/css/*.css")
        .pipe(vinylPaths(del))
        .pipe(postCSS(processors))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("www/css"))
});

gulp.task("minify:js", function() {
    return gulp.src(["www/js/*.js", "!www/js/jquery*.js"])
        .pipe(vinylPaths(del))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("www/js"))
});

gulp.task("minify", ["minify:css", "minify:js"]);

gulp.task("test", shell.task([
    "harp server"
]));

gulp.task("build", shell.task([
    "harp compile",
    "gulp minify"
]));

gulp.task("default", ["build"]);