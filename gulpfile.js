'use strict';

const
    { dest, parallel, src } = require('gulp'),
    cssNano = require('cssnano'),
    del = require('del'),
    postCSS = require('gulp-postcss'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    vinylPaths = require('vinyl-paths');

const minifyCSS = async () => {
    const cssPlugins = [cssNano({ autoprefixer: false, discardUnused: false, zindex: false })];

    src('www/css/*.css')
        .pipe(vinylPaths(del))
        .pipe(postCSS(cssPlugins))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('www/css'))
};

const minifyJS = async () => {
    src(['www/js/*.js', '!www/js/jquery*.js'])
        .pipe(vinylPaths(del))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('www/js'))
};

exports.default = parallel(minifyCSS, minifyJS);