var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var browserify = require('gulp-browserify');
var babel = require('babelify');

gulp.task('default', function() {
	gulp.src('src/herman.js')
		.pipe(browserify({transform : [babel]}))
		.pipe(gulp.dest('./build'))
		.pipe(rename('herman.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./build'));
});