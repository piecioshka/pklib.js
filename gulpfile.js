/*jslint devel: true, continue: true, nomen: true, plusplus: true, regexp: true, vars: true, white: true, indent: 4, node: true */
/*global require, __dirname */

(function () {
    'use strict';

    var gulp = require('gulp');
    var gutil = require('gulp-util');
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');

    gulp.task('scripts', function () {
        return gulp.src('pklib.js')
            .pipe(concat('pklib.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./'));
    });

    gulp.task('default', ['scripts'], function () {
        gutil.log(gutil.colors.yellow('Minification finished.'));
    });
}());