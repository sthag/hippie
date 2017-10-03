// Setup project
var source = {
  watch: ['source/style/**/*.scss', 'source/templates/**/*.+(html|nunjucks)', 'source/pages/**/*.+(html|nunjucks)'],
  styles: ['source/style/example.scss', 'source/style/maintenance.scss'],
  scripts: ['source/code/variables.js', 'source/code/functions.js', 'source/code/global.js', 'source/code/**/*.coffee', '!source/vendor/**/*', ],
  images: 'source/art/**/*',
  pages: 'source/pages/**/*.+(html|nunjucks)',
  vendor: 'vendor/**/*'
};
var build = {
  styles: 'build/css',
  scripts: 'build/js',
  images: 'build/art',
  vendor: 'build/vendor',
  root: 'build'
}

// Load plugins
const gulp = require('gulp'),
rename = require('gulp-rename'),
del = require('del');
gulpif = require('gulp-if');
sequencer = require('run-sequence');
concat = require('gulp-concat'),
pump = require('pump'),
sourcemap = require('gulp-sourcemaps'),
prefix = require('gulp-autoprefixer'),
testsass = require('gulp-sass'),
sass = require('gulp-ruby-sass'),
nunjucks = require('gulp-nunjucks-render');
cssnano = require('gulp-cssnano'),
jshint = require('gulp-jshint'),
jscs = require('gulp-jscs'),
sasslint = require('gulp-sass-lint'),
uglifyjs = require('uglify-es'),
composer = require('gulp-uglify/composer'),
// imagemin = require('gulp-imagemin'),
spritesmith = require('gulp.spritesmith'),
cache = require('gulp-cached'),
remember = require('gulp-remember'),
changed = require('gulp-changed'),
newer = require('gulp-newer'),
plumber = require('gulp-plumber'),
notify = require('gulp-notify'),
browsersync = require('browser-sync').create();

var minify = composer(uglifyjs, console);

// TEST - Tasks
gulp.task('test', function() {
  return gulp.src('source/style/**/*.+(scss|sass)')
  .pipe(plumbError('Error Running Sass'))
  .pipe(sourcemap.init())
  .pipe(testsass({
    includePaths: ['source/bower_components']
  }))
  .pipe(prefix(['>= 4%', 'last 2 version']))
  .pipe(sourcemap.write())
  .pipe(gulp.dest('build/css'))
  .pipe(browsersync.reload({
    stream: true
  }))
});

gulp.task('testsync', function() {
  browsersync.init({
    open: false,
    server: 'build',
    // proxy: "http://verser.vrt/virtual/"
  });
});

gulp.task('testnunjucks', function() {
  return gulp.src('source/pages/**/*.+(html|nunjucks)')
  .pipe(plumbError('Error Running Nunjucks'))
  .pipe(nunjucks({
    path: ['source/templates'],
    envOptions: {
      trimBlocks: true
    }
  }))
  .pipe(gulp.dest('build'))
  .pipe(browsersync.reload({
    stream: true
  }))
});

gulp.task('sprites', function() {
  gulp.src('source/art/sprites/**/*')
  .pipe(spritesmith({
    cssName: '_sprites.scss',
    imgName: 'sprites.png'
  }))
  .pipe(gulpif('*.png', gulp.dest('build/images')))
  .pipe(gulpif('*.scss', gulp.dest('source/style/modules/media')));
});

gulp.task('lint:js', function() {
  return gulp.src('source/code/**/*.js')
  .pipe(plumbError('JSHint Error'))
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail', {
    ignoreWarning: true,
    ignoreInfo: true
  }))
  .pipe(jscs({
    fix: false,
    configPath: '.jscsrc'
  }))
  // .pipe(jscs.reporter());
});

gulp.task('lint:scss', function() {
  return gulp.src('source/style/**/*.scss')
  .pipe(plumbError('SASSLint Error'))
  .pipe(sasslint({
    configFile: '.sass-lint.yml'
  }))
})

gulp.task('clean:dev', function() {
  del.sync([
    'build/css',
    'build/*.html'
  ]);
});



// Task - Clean build directory
gulp.task('clean', function() {
  return del([build.scripts, build.styles, build.images]);
});

// Task - Styles
gulp.task('styles', () => sass(source.styles, {sourcemap: true})
.on('error', sass.logError)
// .pipe(newer({dest: build.styles, ext: '.css'}))
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
  .pipe(changed(build.images))
  // .pipe(cache(imagemin({
  //   optimizationLevel: 3,
  //   progressive: true,
  //   interlaced: true })))
  // )
  .pipe(gulp.dest(build.images))
  // .pipe(notify({ message: 'Images task complete' }))
  ;
});

// Task - Vendor
gulp.task('vendor', function() {
  return gulp.src(source.vendor)
  .pipe(plumbError())
  .pipe(gulp.dest(build.vendor))
  ;
});

//Task - Nunjucks
gulp.task('nunjucks', function() {
  return gulp.src(source.pages)
  // .pipe(changed(build.root))
  .pipe(nunjucks({
    path: ['source/templates'],
    envOptions: {
      trimBlocks: true
    }
  }))
  .pipe(gulp.dest(build.root))
});

// a task that ensures the other task is complete before reloading browsers
gulp.task('overwatch', ['nunjucks', 'styles'], function(done) {
    browsersync.reload();
    done();
});



// TEST - Watch
gulp.task('watch-js', ['lint:js'], browsersync.reload);

gulp.task('testwatch', function() {
  gulp.watch('source/code/**/*.js', ['watch-js'])
  gulp.watch('source/style/**/*.+(scss|sass)', ['test', 'lint:scss']);
  gulp.watch([
    'source/templates/**/*',
    'source/pages/**/*.+(html|nunjucks)'
  ], ['testnunjucks']);
});



// Watch for file changes
gulp.task('watch', ['styles', 'scripts', 'nunjucks'], function() {
  browsersync.init({
    open: false,
    server: build.root,
    // proxy: "http://verser.vrt/virtual/"
  });

  gulp.watch(source.scripts, ['scripts']).on('change', function(event) {
    if (event.type === 'deleted') {
      delete cache.caches['scripts'][event.path];
      remember.forget('scripts', event.path);
    }
  });
  // gulp.watch(source.watch, ['overwatch']);
  gulp.watch(source.watch, ['styles', 'nunjucks']).on('change', browsersync.reload);
  // gulp.watch(source.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('olddefault', ['clean', 'styles', 'scripts', 'images', 'nunjucks']);

gulp.task('default', function(callback) {
  sequencer(
    'clean:dev',
    ['sprites', 'lint:js', 'lint:scss'],
    ['test', 'testnunjucks'],
    ['testsync', 'testwatch'],
    callback
  )
});



// function errorHandler(err) {
//   // Logs out error in the command line
//   console.log(err.toString());
//   // Ends the current pipe, so Gulp watch doesn't break
//   this.emit('end');
// }

function plumbError(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: true
    })
  });
}
