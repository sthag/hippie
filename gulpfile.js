// Setup project
const hippie = {
  brand: 'hippie',
  jsFile: 'main',
  dbFile: 'db'
}

// Gulp requirements
const { watch, series, parallel } = require('gulp');
const { src, dest } = require('gulp');

const fs = require('fs');
const del = require('del');
const plumber = require('gulp-plumber');
// const notify = require('gulp-notify');

const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const jsonConcat = require('gulp-json-concat');
const browserSync = require('browser-sync'), server = browserSync.create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sassLint = require('gulp-sass-lint');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const pump = require('pump');
const cache = require('gulp-cached');
const remember = require('gulp-remember');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');
const merge = require('merge-stream');
// const spritesmith = require('gulp.spritesmith');
// const buffer = require('vinyl-buffer');
// const imagemin = require('gulp-imagemin');

// Paths to data
const input = {
  root: 'source',
  screens: 'source/screens/**/*.+(njk|html)',
  templates: 'source/templates',
  data: {
    hippie: 'source/data/demo.json',
    app: ['source/data/**/*.json', '!source/data/demo_data.json'],
    watch: 'source/data/**/*.json',
  },
  style: 'source/style/**/*.s+(a|c)ss',
  code: ['source/code/hippie/variables.js', 'source/code/hippie/functions.js', 'source/code/hippie/global.js', '!source/vendor/**/*'],
  fonts: 'node_modules/@fortawesome/fontawesome-free/webfonts/**/*',
  art: {
    favicons: 'source/art/favicons/**/*.+(ico|png)',
    sprites: 'source/art/sprites/**/*.png',
    images: 'source/art/images/**/*.+(png|gif|jpg)'
  },
  vendor: 'vendor/**/*'
  // watch: ['source/style/hippie/**/*.scss', 'source/style/**/*.scss', 'source/templates/**/*.+(html|njk)', 'source/screens/**/*.+(html|njk)']
};

const output = {
  root: 'build',
  screens: 'build/**/*.html',
  data: 'build/json',
  style: 'build/css',
  code: 'build/js',
  fonts: 'build/fonts',
  art: 'build/art',
  reports: 'reports',
  vendor: 'build/vendor'
};

// Create tasks

// Clean build folder
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(output.root +'/**');
}
// cleans the build folder
// gulp.task('clean:dev', function() {
//   return del.sync([
//     output.style,
//     output.screens,
//     output.root+'/*.html'
//   ]);
// });

// Automagically reload browsers
function reload(done) {
  server.reload();

  done();
}

// Concatenate JSON files
function json() {
  return src(input.data.app)
  .pipe(jsonConcat(jsonFile +'.json', function(data) {
    return new Buffer(JSON.stringify(data));
  }))
  .pipe(gulp.dest(output.data));
}

// Transpile HTML
function nunjucks() {
	return src(input.screens)
  .pipe(plumber())
  .pipe(data(function() {
    let data = JSON.parse(fs.readFileSync(input.data.hippie));
    object = {hippie, data};
    return object;
  }))
	.pipe(nunjucksRender({
		path: input.templates,
    envOptions: {
      trimBlocks: true
    }
	}))
	.pipe(dest(output.root));
}
// templating engine
// gulp.task('nunjucks', function() {
//   return gulp.src('source/screens/**/*.+(html|njk)')
//   .pipe(plumbError('Error Running Nunjucks'))
//   .pipe(data(function() {
//     return JSON.parse(fs.readFileSync('./source/demo_data.json'))
//   }))
//   .pipe(nunjucks({
//     path: output.templates,
//     envOptions: {
//       trimBlocks: true
//     }
//   }))
//   .pipe(gulp.dest(output.root))
//   .pipe(server.reload({
//     stream: true
//   }))
// });

// Serve files to the browser
function serve(done) {
  server.init({
    index: "demo.html",
    open: false,
    server: output.root
  });

  done();
}
// automagically reload browsers
// gulp.task('syncreload', function() {
//   server.init({
//     // ------------------------------------------------------------------------------
//     // comment out the line below to get rid of the demo index page.
//     // ------------------------------------------------------------------------------
//     index: "demo.html",
//     open: false,
//     server: 'build'
//     // online: false,
//     // logLevel: "info",
//     // proxy: "http://verser.vrt/virtual/",
//     // watch: true,
//   });
// });

// This is for the looks
function style() {
  return src(input.style)
  .pipe(plumber())
  // .pipe(plumbError('STYLE problems'))
  .pipe(sass({
    includePaths: [input.vendor +'/**/*.s+(a|c)ss']
  }))
  .pipe(autoprefixer(['>= 4%', 'last 2 version']))
  .pipe(dest(output.style))
  .pipe(cleanCss())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(dest(output.style));
}
// Linting
function styleLint() {
  var file = fs.createWriteStream(output.reports +'/sass-lint.html');
  var stream = src(input.style)
  .pipe(plumber())
  .pipe(sassLint({
    configFile: '.sasslintrc',
    files: {
      ignore: input.vendor +'/**/*.s+(a|c)ss'
    }
  }))
  .pipe(sassLint.format(file));

  stream.on('finish', function() {
    file.end();
  });

  return stream;
}
// this is for the looks
// gulp.task('sass', function() {
//   return gulp.src(input.style)
//   .pipe(plumbError('Error Running Sass'))
//   .pipe(sourcemap.init())
//   .pipe(sass({
//     includePaths: [input.root+'/bower_components']
//   }))
//   .pipe(autoprefixer(['>= 4%', 'last 2 version']))
//   // .pipe(cssnano())
//   .pipe(sourcemap.write())
//   .pipe(gulp.dest(output.style))
//   .pipe(server.reload({
//     stream: true
//   }))
// });
// // linting ...
// gulp.task('lint:scss', function() {
//   return gulp.src('source/style/**/*.scss')
//   .pipe(plumbError('SASSLint Error'))
//   .pipe(sasslint({
//     configFile: '.sass-lint.yml'
//   }))
// })

// Javascript for the win
function code(cb) {
  pump([
    src(input.code, { sourcemaps: true }),
    cache('code'),
    concat(hippie.jsFile +'.js'),
    dest(output.code),
    uglify(),
    remember('code'),
    rename({
      suffix: '.min'
    }),
    dest(output.code, { sourcemaps: '.' }),
  ], cb);
}
// Linting
function codeLint() {
  return src(input.code)
  .pipe(plumber())
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail', {
    ignoreWarning: true,
    ignoreInfo: true
  }));
}
// and this is functionality
// gulp.task('js', function(cb) {
//   pump([
//     gulp.src(input.code),
//     cache('code'),
//     // jshint('.jshintrc'),
//     // jshint.reporter('default'),
//     sourcemap.init(),
//     minify(),
//     remember('code'),
//     concat('all.min.js'),
//     sourcemap.write(),
//     gulp.dest(output.code),
//     server.stream()
//   ], cb);
// });
// // linting ...
// gulp.task('lint:js', function() {
//   return gulp.src('source/code/**/*.js')
//   .pipe(plumbError('JSHint Error'))
//   .pipe(jshint())
//   .pipe(jshint.reporter('jshint-stylish'))
//   .pipe(jshint.reporter('fail', {
//     ignoreWarning: true,
//     ignoreInfo: true
//   }))
//   .pipe(jscs({
//     fix: false,
//     configPath: '.jscsrc'
//   }))
//   // .pipe(jscs.reporter());
// });

// Fonts
function fonts() {
  return src(input.fonts)
  .pipe(plumber())
  .pipe(dest(output.fonts))
}

// Add art
function art() {
  // Move favicons to the root folder
  let favicons = src(input.art.favicons)
  .pipe(changed(output.art))
  .pipe(dest(output.root))

  // Assemble sprites

  // Move images to the root folder
  let images = src(input.art.images)
  .pipe(changed(output.art))
  .pipe(dest(output.art))

  return merge(favicons, images)
}
// creates sprites from files in art/sprites folder
// gulp.task('sprites', function() {
//   gulp.src('source/art/sprites/**/*')
//   .pipe(spritesmith({
//     cssName: '_sprites.scss',
//     imgName: 'sprites.png',
//     imgPath: '../art/sprites.png',
//     // retinaSrcFilter:	'source/art/sprites/*@2x.png',
//     // retinaImgName:	'sprites@2x.png',
//     // retinaImgPath:	'../art/sprites@2x.png'
//   }))
//   .pipe(gulpif('*.png', gulp.dest(output.art)))
//   .pipe(gulpif('*.scss', gulp.dest('source/style/hippie/mixins')));
// });
// copy art files
// gulp.task('art', function() {
//   return gulp.src(input.art)
//   .pipe(plumbError())
//   .pipe(gulp.dest(output.art))
//   ;
// });
// copy additional files
// gulp.task('favicon', function() {
//   return gulp.src('source/favicon.ico')
//   .pipe(plumbError())
//   .pipe(gulp.dest(output.root))
//   ;
// });

// Gather dependencies for tools
function vendor() {
  return src(input.vendor)
  .pipe(plumber())
  .pipe(dest(output.vendor))
}
// copy vendor files
// gulp.task('vendor', function() {
//   return gulp.src(input.vendor)
//   .pipe(plumbError())
//   .pipe(gulp.dest(output.vendor))
//   ;
// });

function overview() {
  watch([input.screens, input.data.watch], series(nunjucks, reload));
  watch(input.style, series(styleLint, style, reload));
  watch(input.code, series(codeLint, code, reload));
  watch(input.fonts, series(fonts, reload));
  watch([input.art.favicons, input.art.sprites, input.art.images], series(art, reload));
  // watch(input.data.app, series(json, reload));
}

const assets = parallel(fonts, art, vendor);
const build = series(clean, assets, parallel(nunjucks, series(styleLint, style), series(codeLint, code)));

exports.lint = parallel(styleLint, codeLint);
exports.assets = assets;
exports.build = build;
exports.default = series(build, serve, overview);
// watch over changes and react
// split up into sub tasks
// gulp.task('watch-js', ['lint:js', 'js'], server.reload);
//
// gulp.task('overwatch', function() {
//   gulp.watch('source/code/**/*.js', ['watch-js'])
//   gulp.watch('source/style/**/*.+(scss|sass)', ['sass', 'lint:scss']);
//   gulp.watch([
//     'source/templates/**/*',
//     'source/screens/**/*.+(html|njk)',
//     'source/demo_data.json'
//   ], ['nunjucks']);
//   gulp.watch('source/art/**/*', ['sprites']);
// });
//
//
// // The default task (called when you run `gulp` from cli)
// gulp.task('default', function(callback) {
//   sequencer(
//     'clean:dev',
//     ['sprites', 'art', 'vendor', 'favicon', 'lint:js', 'lint:scss'],
//     ['sass', 'js', 'nunjucks'],
//     ['syncreload', 'overwatch'],
//     callback
//   )
// });

// function plumbError(errTitle) {
//   return plumber({
//     errorHandler: notify.onError({
//       // Customizing error title
//       title: errTitle || "GULP GENERAL PROBLEM",
//       message: "<%= error.message %>"
//     })
//   });
// }
