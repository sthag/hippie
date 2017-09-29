// Setup project
var source = {
  markup: '*.html',
  watch: 'source/style/**/*.scss',
  styles: 'source/style/example.scss',
  scripts: ['source/code/variables.js', 'source/code/functions.js', 'source/code/global.js', 'source/code/**/*.coffee', '!source/vendor/**/*', ],
  images: 'source/art/**/*'
};
var build = {
  styles: 'build/css',
  scripts: 'build/js',
  images: 'build/art'
}

// Load plugins
const gulp = require('gulp'),
      rename = require('gulp-rename'),
      del = require('del');
      concat = require('gulp-concat'),
      pump = require('pump'),
      sourcemap = require('gulp-sourcemaps'),
      prefix = require('gulp-autoprefixer'),
      sass = require('gulp-ruby-sass'),
      cssnano = require('gulp-cssnano'),
      jshint = require('gulp-jshint'),
			uglifyjs = require('uglify-es'),
      composer = require('gulp-uglify/composer'),
      // imagemin = require('gulp-imagemin'),
      cache = require('gulp-cached'),
      remember = require('gulp-remember'),
      changed = require('gulp-changed'),
      notify = require('gulp-notify'),
      browsersync = require('browser-sync').create();

var minify = composer(uglifyjs, console);

// Task - Clean build directory
gulp.task('clean', function() {
  return del([build.scripts, build.styles, 'build/**']);
});

// Task - Styles
gulp.task('styles', () =>
  sass(source.styles, {sourcemap: true})
  .on('error', sass.logError)
  .pipe(prefix('last 2 version'))
  .pipe(gulp.dest(build.styles))
  .pipe(rename({suffix: '.min'}))
  .pipe(cssnano())
  .pipe(sourcemap.write('.', {
    includeContent: false,
    sourceRoot: 'source'
  }))
  .pipe(gulp.dest(build.styles))
  .pipe(browsersync.stream({match: '**/*.css'}))
  // .pipe(notify({message: 'Style task complete'}))
);

// Task - Scripts
gulp.task('scripts', function(cb) {
  pump([
    gulp.src(source.scripts),
    cache('scripts'),
    jshint('.jshintrc'),
    jshint.reporter('default'),
    sourcemap.init(),
    minify(),
    remember('scripts'),
    concat('all.min.js'),
    sourcemap.write(),
    gulp.dest(build.scripts),
    browsersync.stream()
  ], cb);
});

// Task - Images
gulp.task('images', function() {
  return gulp.src(source.images)
  .pipe(changed(cache(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true })))
  )
  .pipe(gulp.dest(build.images))
  .pipe(notify({ message: 'Images task complete' }))
  ;
});

// Watch for file changes
gulp.task('watch', ['clean', 'styles', 'scripts'], function() {
	browsersync.init({
		server: "./",
		// proxy: "http://verser.vrt/virtual/"
  });

  gulp.watch(source.watch, ['styles']);
  gulp.watch(source.scripts, ['scripts']).on('change', function(event) {
    if (event.type === 'deleted') {
      delete cache.caches['scripts'][event.path];
      remember.forget('scripts', event.path);
    }
  });
  gulp.watch(source.markup).on('change', browsersync.reload);
  // gulp.watch(['build/**']).on('change', browsersync.reload);
  // gulp.watch(source.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['clean', 'styles', 'scripts']);
