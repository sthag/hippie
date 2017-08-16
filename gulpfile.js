const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');

gulp.task('default', function(){
	console.log('default gulp task...')
});

gulp.task('sass', () =>
sass('./*.scss', {sourcemap: true})
// .on('error', sass.logError)
.pipe(plumber(errorReport("sass error")))
.pipe(sourcemaps.write('./', {
	includeContent: false,
	sourceRoot: 'source'
}))
.pipe(gulp.dest('./'))
.pipe(livereload())
);

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('./**/*.scss', ['sass']);
	gulp.watch(['*.html']).on('change', livereload.changed);
	// gulp.watch('js/src/*.js', ['js']);
	// gulp.watch('img/src/*.{png,jpg,gif}', ['img']);

});

gulp.task('default', ['sass', 'watch']);



function errorReport(errTitle) {
	return plumber({
		errorHandler: notify.onError({
			// Customizing error title
			title: errTitle || "Error running Gulp",
			message: "Error: <%= error.message %>",
			sound: true
		})
	});
}
