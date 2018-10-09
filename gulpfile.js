// Setup project
var source_folder = {
  watch: ['source/style/hippie/**/*.scss', 'source/style/**/*.scss', 'source/templates/**/*.+(html|njk)', 'source/pages/**/*.+(html|njk)'],
  styles: ['source/style/hippie/*.+(scss|sass)', 'source/style/**/*.+(scss|sass)'],
  scripts: ['source/code/hippie/variables.js', 'source/code/hippie/functions.js', 'source/code/hippie/global.js', 'source/code/**/*.coffee', '!source/vendor/**/*', ],
  images: 'source/art/images/**/*',
  pages: 'source/pages/**/*.+(html|njk)',
  vendor: 'vendor/**/*',
  root: 'source'
};
var build_folder = {
  styles: 'build/css',
  scripts: 'build/js',
  art: 'build/art',
  vendor: 'build/vendor',
  pages: 'build/**/*.html',
  root: 'build'
}

// Load plugins
const fs = require('fs');
const gulp = require('gulp');
// const rename = require('gulp-rename');
const del = require('del');
const gulpif = require('gulp-if');
const sequencer = require('run-sequence');
const sourcemap = require('gulp-sourcemaps');
const prefix = require('gulp-autoprefixer');
const sass = require('gulp-sass');
// const rubysass = require('gulp-ruby-sass');
const nunjucks = require('gulp-nunjucks-render');
// const cssnano = require('gulp-cssnano');
const jshint = require('gulp-jshint');
const jscs = require('gulp-jscs');
// const useref = require('gulp-useref');
const sasslint = require('gulp-sass-lint');
// const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');
// const changed = require('gulp-changed');
// const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const data = require('gulp-data');
const browsersync = require('browser-sync').create();

// only used for js task
const concat = require('gulp-concat');
const pump = require('pump');
const composer = require('gulp-uglify/composer');
const uglifyjs = require('uglify-es');
const minify = composer(uglifyjs, console);
const cache = require('gulp-cached');
const remember = require('gulp-remember');




// this is for the looks
gulp.task('sass', function() {
  return gulp.src(source_folder.styles)
  .pipe(plumbError('Error Running Sass'))
  .pipe(sourcemap.init())
  .pipe(sass({
    includePaths: [source_folder.root+'/bower_components']
  }))
  .pipe(prefix(['>= 4%', 'last 2 version']))
  // .pipe(cssnano())
  .pipe(sourcemap.write())
  .pipe(gulp.dest(build_folder.styles))
  .pipe(browsersync.reload({
    stream: true
  }))
});


// and this is functionality
gulp.task('js', function(cb) {
  pump([
    gulp.src(source_folder.scripts),
    cache('scripts'),
    jshint('.jshintrc'),
    jshint.reporter('default'),
    sourcemap.init(),
    minify(),
    remember('scripts'),
    concat('all.min.js'),
    sourcemap.write(),
    gulp.dest(build_folder.scripts),
    browsersync.stream()
  ], cb);
});


// templating engine
gulp.task('nunjucks', function() {
  return gulp.src('source/pages/**/*.+(html|njk)')
  .pipe(plumbError('Error Running Nunjucks'))
  .pipe(data(function() {
    return JSON.parse(fs.readFileSync('./source/demo_data.json'))
  }))
  .pipe(nunjucks({
    path: ['source/templates'],
    envOptions: {
      trimBlocks: true
    }
  }))
  .pipe(gulp.dest(build_folder.root))
  .pipe(browsersync.reload({
    stream: true
  }))
});


// automagically reload browsers
gulp.task('syncreload', function() {
  browsersync.init({
    // ------------------------------------------------------------------------------
    // comment out the line below to get rid of the demo index page.
    // ------------------------------------------------------------------------------
    index: "demo.html",
    open: false,
    server: 'build'
    // online: false,
    // logLevel: "info",
    // proxy: "http://verser.vrt/virtual/",
    // watch: true,
  });
});


// creates sprites from files in art/sprites folder
gulp.task('sprites', function() {
  gulp.src('source/art/sprites/**/*')
  .pipe(spritesmith({
    cssName: '_sprites.scss',
    imgName: 'sprites.png'
  }))
  .pipe(gulpif('*.png', gulp.dest(build_folder.art)))
  .pipe(gulpif('*.scss', gulp.dest('source/style/hippie/modules/media')));
});

// copy art files
gulp.task('art', function() {
  return gulp.src(source_folder.images)
  .pipe(plumbError())
  .pipe(gulp.dest(build_folder.art))
  ;
});

// copy vendor files
gulp.task('vendor', function() {
  return gulp.src(source_folder.vendor)
  .pipe(plumbError())
  .pipe(gulp.dest(build_folder.vendor))
  ;
});

// linting ...
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


// cleans the build folder
gulp.task('clean:dev', function() {
  del.sync([
    build_folder.styles,
    build_folder.pages,
    build_folder.root+'/*.html'
  ]);
});




// watch over changes and react
// split up into sub tasks
gulp.task('watch-js', ['lint:js', 'js'], browsersync.reload);

gulp.task('overwatch', function() {
  gulp.watch('source/code/**/*.js', ['watch-js'])
  gulp.watch('source/style/**/*.+(scss|sass)', ['sass', 'lint:scss']);
  gulp.watch([
    'source/templates/**/*',
    'source/pages/**/*.+(html|njk)',
    'source/art/**/*',
    'source/demo_data.json'
  ], ['nunjucks']);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', function(callback) {
  sequencer(
    'clean:dev',
    ['sprites', 'art', 'vendor', 'lint:js', 'lint:scss'],
    ['sass', 'js', 'nunjucks'],
    ['syncreload', 'overwatch'],
    callback
  )
});


function plumbError(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "<%= error.message %>"
    })
  });
}
