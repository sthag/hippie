// Setup project
var source_folder = {
  watch: ['source/style/hippie/**/*.scss', 'source/style/**/*.scss', 'source/templates/**/*.+(html|njk)', 'source/pages/**/*.+(html|njk)'],
  styles: ['source/style/hippie/*.+(scss|sass)', 'source/style/**/*.+(scss|sass)'],
  scripts: ['source/code/hippie/variables.js', 'source/code/hippie/functions.js', 'source/code/hippie/global.js', 'source/code/**/*.coffee', '!source/vendor/**/*', ],
  images: 'source/art/**/*',
  pages: 'source/pages/**/*.+(html|njk)',
  vendor: 'vendor/**/*',
  root: 'source'
};
var build_folder = {
  styles: 'build/css',
  scripts: 'build/js',
  images: 'build/art',
  vendor: 'build/vendor',
  root: 'build'
}

// Load plugins
var fs = require('fs');
const gulp = require('gulp'),
// rename = require('gulp-rename'),
del = require('del');
gulpif = require('gulp-if');
sequencer = require('run-sequence');
// concat = require('gulp-concat'),
// pump = require('pump'),
sourcemap = require('gulp-sourcemaps'),
prefix = require('gulp-autoprefixer'),
sass = require('gulp-sass'),
// rubysass = require('gulp-ruby-sass'),
nunjucks = require('gulp-nunjucks-render');
// cssnano = require('gulp-cssnano'),
jshint = require('gulp-jshint'),
jscs = require('gulp-jscs'),
// useref = require('gulp-useref'),
sasslint = require('gulp-sass-lint'),
// uglifyjs = require('uglify-es'),
// composer = require('gulp-uglify/composer'),
// imagemin = require('gulp-imagemin'),
spritesmith = require('gulp.spritesmith'),
// cache = require('gulp-cached'),
// remember = require('gulp-remember'),
// changed = require('gulp-changed'),
// newer = require('gulp-newer'),
plumber = require('gulp-plumber'),
notify = require('gulp-notify'),
data = require('gulp-data'),
browsersync = require('browser-sync').create();

// var minify = composer(uglifyjs, console);




// this is for the looks
gulp.task('sass', function() {
  return gulp.src(source_folder.styles)
  .pipe(plumbError('Error Running Sass'))
  .pipe(sourcemap.init())
  .pipe(sass({
    includePaths: [source_folder.root+'/bower_components']
  }))
  .pipe(prefix(['>= 4%', 'last 2 version']))
  .pipe(sourcemap.write())
  .pipe(gulp.dest(build_folder.styles))
  .pipe(browsersync.reload({
    stream: true
  }))
});


// templating engine
gulp.task('nunjucks', function() {
  return gulp.src('source/pages/**/*.+(html|njk)')
  .pipe(plumbError('Error Running Nunjucks'))
  .pipe(data(function() {
    return JSON.parse(fs.readFileSync('./source/data.json'))
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
    open: false,
    server: 'build',
    // proxy: "http://verser.vrt/virtual/"
  });
});


// creates sprites from files in art/sprites folder
gulp.task('sprites', function() {
  gulp.src('source/art/sprites/**/*')
  .pipe(spritesmith({
    cssName: '_sprites.scss',
    imgName: 'sprites.png'
  }))
  .pipe(gulpif('*.png', gulp.dest(build_folder.images)))
  .pipe(gulpif('*.scss', gulp.dest('source/style/hippie/modules/media')));
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
    build_folder.root+'/*.html'
  ]);
});




// watch over changes and react
// split up into sub tasks
gulp.task('watch-js', ['lint:js'], browsersync.reload);

gulp.task('overwatch', function() {
  gulp.watch('source/code/**/*.js', ['watch-js'])
  gulp.watch('source/style/**/*.+(scss|sass)', ['sass', 'lint:scss']);
  gulp.watch([
    'source/templates/**/*',
    'source/pages/**/*.+(html|njk)',
    'source/data.json'
  ], ['nunjucks']);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', function(callback) {
  sequencer(
    'clean:dev',
    ['sprites', 'lint:js', 'lint:scss'],
    ['sass', 'nunjucks'],
    ['syncreload', 'overwatch'],
    callback
  )
});


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








// NOTE // to be deleted

var oldsource = {
  watch: ['source/style/hippie/**/*.scss', 'source/style/**/*.scss', 'source/templates/**/*.+(html|njk)', 'source/pages/**/*.+(html|njk)'],
  styles: ['source/style/demo.scss', 'source/style/maintenance.scss'],
  scripts: ['source/code/hippie/variables.js', 'source/code/hippie/functions.js', 'source/code/hippie/global.js', 'source/code/**/*.coffee', '!source/vendor/**/*', ],
  images: 'source/art/**/*',
  pages: 'source/pages/**/*.+(html|njk)',
  vendor: 'vendor/**/*'
};
var oldbuild = {
  styles: 'build/css',
  scripts: 'build/js',
  images: 'build/art',
  vendor: 'build/vendor',
  root: 'build'
}

// Task - Clean build directory
gulp.task('clean', function() {
  return del([oldbuild.scripts, oldbuild.styles, oldbuild.images]);
});

// Task - Styles
gulp.task('styles', () => rubysass(oldsource.styles, {sourcemap: true})
.on('error', rubysass.logError)
// .pipe(newer({dest: oldbuild.styles, ext: '.css'}))
.pipe(prefix('last 2 version'))
.pipe(gulp.dest(oldbuild.styles))
.pipe(rename({suffix: '.min'}))
.pipe(cssnano())
.pipe(sourcemap.write('.', {
  includeContent: false,
  sourceRoot: 'source'
}))
.pipe(gulp.dest(oldbuild.styles))
.pipe(browsersync.stream({match: '**/*.css'}))
// .pipe(notify({message: 'Style task complete'}))
);

// Task - Scripts
gulp.task('scripts', function(cb) {
  pump([
    gulp.src(oldsource.scripts),
    cache('scripts'),
    jshint('.jshintrc'),
    jshint.reporter('default'),
    sourcemap.init(),
    minify(),
    remember('scripts'),
    concat('all.min.js'),
    sourcemap.write(),
    gulp.dest(oldbuild.scripts),
    browsersync.stream()
  ], cb);
});

// Task - Images
gulp.task('images', function() {
  return gulp.src(oldsource.images)
  .pipe(changed(oldbuild.images))
  // .pipe(cache(imagemin({
    //   optimizationLevel: 3,
    //   progressive: true,
    //   interlaced: true })))
    // )
    .pipe(gulp.dest(oldbuild.images))
    // .pipe(notify({ message: 'Images task complete' }))
    ;
  });

  // Task - Vendor
  gulp.task('vendor', function() {
    return gulp.src(oldsource.vendor)
    .pipe(plumbError())
    .pipe(gulp.dest(oldbuild.vendor))
    ;
  });

  //Task - Nunjucks
  gulp.task('oldnunjucks', function() {
    return gulp.src(oldsource.pages)
    // .pipe(changed(oldbuild.root))
    .pipe(nunjucks({
      path: ['source/templates'],
      envOptions: {
        trimBlocks: true
      }
    }))
    .pipe(gulp.dest(oldbuild.root))
  });

  // a task that ensures the other task is complete before reloading browsers
  gulp.task('prewatch', ['oldnunjucks', 'styles'], function(done) {
    browsersync.reload();
    done();
  });

  // Old watch for file changes
  gulp.task('oldwatch', ['styles', 'scripts', 'oldnunjucks'], function() {
    browsersync.init({
      open: false,
      server: oldbuild.root,
      // proxy: "http://verser.vrt/virtual/"
    });

    gulp.watch(oldsource.scripts, ['scripts']).on('change', function(event) {
      if (event.type === 'deleted') {
        delete cache.caches['scripts'][event.path];
        remember.forget('scripts', event.path);
      }
    });
    // gulp.watch(oldsource.watch, ['prewatch']);
    gulp.watch(oldsource.watch, ['styles', 'oldnunjucks']).on('change', browsersync.reload);
    // gulp.watch(oldsource.images, ['images']);
  });

  gulp.task('olddefault', ['clean', 'styles', 'scripts', 'images', 'nunjucks']);

  // function errorHandler(err) {
    //   // Logs out error in the command line
    //   console.log(err.toString());
    //   // Ends the current pipe, so Gulp watch doesn't break
    //   this.emit('end');
    // }
