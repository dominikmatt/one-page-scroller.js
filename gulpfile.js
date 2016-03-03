var gulp = require('gulp');
var connect = require('gulp-connect');
var compass = require('gulp-compass');
var path = require('path');
var watch = require('gulp-watch');

gulp.task('connect', function() {
    connect.server({
        port: 8888
    });
});

gulp.task('compass', function() {
    gulp.src('./examples/assets/scss/*.scss')
        .pipe(compass({
            project: path.join(__dirname, 'examples/assets'),
            css: 'css',
            sass: 'scss'
        }))
        .pipe(gulp.dest('.examples/assets/css'));
});

gulp.task('watch', function () {
    return gulp.watch('./examples/assets/scss/**/*.scss', ['compass']);
});

gulp.task('default', ['connect', 'watch']);