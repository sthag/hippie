// Setup project
const hippie = {
  brand: 'hippie',
  jsFile: 'main',
  jsonFile: 'db',
  index: 'demo.html',
  data: 'demo/data.json'
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
const spritesmith = require('gulp.spritesmith');
// const buffer = require('vinyl-buffer');
// const imagemin = require('gulp-imagemin');

// Paths to data
const input = {
  root: 'source',
  screens: 'source/screens/**/*.+(njk|html)',
  templates: 'source/templates',
  data: 'source/data/**/*.json',
  style: 'source/style/**/*.s+(a|c)ss',
  code: ['source/code/hippie/variables.js', 'source/code/hippie/functions.js', 'source/code/hippie/global.js', '!source/vendor/**/*'],
  fonts: 'node_modules/@fortawesome/fontawesome-free/webfonts/**/*',
  art: {
    favicons: 'source/art/favicons/**/*.+(ico|png)',
    sprites: 'source/art/sprites/**/*.png',
    images: 'source/art/images/**/*.+(png|gif|jpg|webp)'
  },
  vendor: 'vendor/**/*',
  demo: {
    data: 'source/templates/demo/data.json'
  }
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

//Check for index file and deactivate demo content
if (fs.existsSync('source/screens/index.njk')){
  hippie.index = 'index.html';
}
if (fs.existsSync('source/templates/data.json')){
  hippie.data = 'data.json';
}

// Create tasks

// Clean build folder
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(output.root +'/**');
}

// Automagically reload browsers
function reload(done) {
  server.reload();

  done();
}

// Concatenate JSON files
function json() {
  return src(input.data)
  .pipe(plumber())
  .pipe(jsonConcat(hippie.jsonFile +'.json', function(data) {
    return new Buffer(JSON.stringify(data));
  }))
  .pipe(dest(output.data));
}

// Transpile HTML
function nunjucks() {
	return src(input.screens)
  .pipe(plumber())
  .pipe(data(function() {
    let data = JSON.parse(fs.readFileSync(input.templates +'/'+ hippie.data));
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

// Serve files to the browser
function serve(done) {
  server.init({
    index: hippie.index,
    open: false,
    server: output.root
  });

  done();
}

// This is for the looks
function style() {
  return src(input.style)
  .pipe(plumber())
  // .pipe(plumbError('STYLE PROBLEM'))
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
  var dir = output.reports;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
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
  .pipe(plumber())
  .pipe(changed(output.art))
  .pipe(dest(output.root))

  // Move images to the root folder
  let images = src(input.art.images)
  .pipe(plumber())
  .pipe(changed(output.art))
  .pipe(dest(output.art));

  return merge(favicons, images)
}

function sprites() {
  // Assemble sprites
  let sprites = src(input.art.sprites)
  .pipe(plumber())
  .pipe(changed(output.art))
  .pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../art/sprite.png',
    cssName: '_sprite.scss'
  }));

  var imgStream = sprites.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    // .pipe(buffer())
    // .pipe(imagemin())
    .pipe(dest(output.art));

  var cssStream = sprites.css
    .pipe(dest('source/style/hippie/mixins/'));

  return merge(imgStream, cssStream);
}

// Gather dependencies for tools
function vendor() {
  return src(input.vendor)
  .pipe(plumber())
  .pipe(dest(output.vendor))
}

function overview() {
  watch([input.templates, input.screens, input.demo.data], series(nunjucks, reload));
  watch(input.style, series(styleLint, style, reload));
  watch(input.code, series(codeLint, code, reload));
  watch(input.fonts, series(fonts, reload));
  watch(input.art.sprites, series(parallel(sprites, style), reload));
  watch([input.art.favicons, input.art.images], series(art, reload));
  watch(input.data, series(json, reload));
}

const assets = parallel(fonts, art, sprites, json, vendor);
const build = series(clean, assets, parallel(nunjucks, style, code));
const dev = series(clean, assets, parallel(nunjucks, series(styleLint, style), series(codeLint, code)));

exports.lint = parallel(series(style, styleLint), series(code, codeLint));
exports.assets = assets;
exports.build = build;
exports.dev = dev;
exports.default = series(dev, serve, overview);

// function plumbError(errTitle) {
//   return plumber({
//     errorHandler: notify.onError({
//       // Customizing error title
//       title: errTitle || "GULP GENERAL PROBLEM",
//       message: "<%= error.message %>"
//     })
//   });
// }
