// Setup project
const config = require('./gulp/config');

// Gulp requirements
const { watch, series, parallel } = require('gulp');
const { src, dest } = require('gulp');

const fs = require('fs');
const del = require('del');
const plumber = require('gulp-plumber');
// const notify = require('gulp-notify');

const nunjucksRender = require('gulp-nunjucks-render');
// const nunjucks = require('gulp-nunjucks');
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
// const remember = require('gulp-remember');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith');
const babel = require('gulp-babel');
const htmlValidator = require('gulp-w3c-html-validator');
// const buffer = require('vinyl-buffer');
// const imagemin = require('gulp-imagemin');

// Data variables
const input = {
  screens: config.src + 'screens/**/*.+(njk|html)',
  templates: config.src + 'templates/',
  data: config.src + 'data/**/*.json',
  style: config.src + 'style/**/*.s+(a|c)ss',
  code: [
    // config.src + 'code/hippie/config.js',
    // config.src + 'code/hippie/main.js',
    config.src + 'code/hippie/variables.js',
    config.src + 'code/hippie/functions.js',
    config.src + 'code/hippie/global.js',
    // config.src + 'code/variables.js',
    // config.src + 'code/functions.js',
    // config.src + 'code/global.js',
    // config.src + 'code/**/*.js',
    '!' + config.src + 'vendor/**/*'
  ],
  fonts: 'node_modules/@fortawesome/fontawesome-free/webfonts/**/*',
  art: {
    favicons: config.src + 'art/favicons/**/*.+(ico|png)',
    sprites: config.src + 'art/sprites/**/*.png',
    images: config.src + 'art/images/**/*.+(png|gif|jpg|svg|webp)'
  },
  vendor: 'vendor/**/*',
};

const output = {
  root: config.dest,
  screens: config.dest + '**/*.html',
  data: config.dest + 'json',
  style: config.dest + 'css',
  code: config.dest + 'js',
  fonts: config.dest + 'fonts',
  art: config.dest + 'art',
  reports: 'reports/',
  vendor: config.dest + 'vendor'
};

// Show demo content if configured
if (config.demo === true) {
  config.index = 'demo.html';
  config.templateData = config.src + 'templates/demo/data.json';
} else {
  config.frontendData = [config.src + 'data/**/*.json', '!' + config.src + 'data/demo.json'];
}

// Create tasks

// Clean output folders
function clean() {
  return del([output.root + '**', output.reports + '**']);
}

// Automagically reload browsers
function reload(done) {
  server.reload();

  done();
}

// Concatenate JSON files
function json() {
  return src(config.frontendData)
    .pipe(plumber())
    .pipe(jsonConcat(config.hippie.jsonFile + '.json', function (data) {
      return new Buffer.from(JSON.stringify(data));
    }))
    .pipe(dest(output.data));
}

function manageEnvironment(environment) {
  environment.addFilter('slug', function (str) {
    return str && str.replace(/\s/g, '-', str).toLowerCase();
  });

  environment.addGlobal('hippie', config.hippie);
  environment.addGlobal('titlePrefix', config.hippie.titlePrefix);
}

// function getDataForTemplates (file) {
//   const template = JSON.parse(fs.readFileSync(config.templateData));
//   const hippie = config.hippie;
//   // console.log(file.relative);
//   return { hippie, template };
// }
function getDataForTemplates (file) {
  const data = JSON.parse(fs.readFileSync(config.templateData));
  return { data };
}

// Transpile HTML
function nunjucks() {
  return src(input.screens)
    // .pipe(plumber())
    .pipe(customPlumber())
    // TODO only add data to pipe for necessary files
    .pipe(data(getDataForTemplates))
    .pipe(nunjucksRender({
      path: input.templates,
      envOptions: {
        trimBlocks: true
      },
      manageEnv: manageEnvironment
    }))
    .pipe(dest(output.root));
}

function validate() {
  return src(output.screens)
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter());
}

// Serve files to the browser
function serve(done) {
  server.init({
    index: config.index,
    open: false,
    server: output.root
  });

  done();
}

// This is for the looks
function style() {
  return src(input.style)
    // .pipe(plumbError('STYLE PROBLEM'))
    .pipe(sass({
      includePaths: [input.vendor + '/**/*.s+(a|c)ss']
    }).on('error', sass.logError))
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
  const dir = output.reports;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let file = fs.createWriteStream(output.reports + 'sass-lint.html');
  let stream = src(input.style)
    .pipe(plumber())
    .pipe(sassLint({
      configFile: '.sasslintrc',
      files: {
        ignore: input.vendor + '/**/*.s+(a|c)ss'
      }
    }))
    .pipe(sassLint.format(file));

  stream.on('finish', function () {
    file.end();
  });

  return stream;
}

// Javascript for the win
function code(cb) {
  pump([
    src(input.code, {
      sourcemaps: true,
      allowEmpty: true
    }),
    plumber(),
    // cache('code'),
    // babel({ presets: ['@babel/env'] }),
    concat(config.hippie.jsFile + '.js'),
    dest(output.code),
    uglify(),
    // remember('code'),
    rename({
      suffix: '.min'
    }),
    dest(output.code, { sourcemaps: '.' }),
  ], cb);
}
// Linting
function codeLint() {
  return src(input.code, { allowEmpty: true })
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
// function art() {
//   // Move favicons and images to the root folder
//   return src(input.art.favicons)
//     .pipe(plumber())
//     .pipe(changed(output.root))
//     .pipe(dest(output.root))
//     .pipe(src(input.art.images))
//     .pipe(changed(output.art))
//     .pipe(dest(output.art));
// }


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

  const imgStream = sprites.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    // .pipe(buffer())
    // .pipe(imagemin())
    .pipe(dest(output.art));

  const cssStream = sprites.css
    .pipe(dest(config.src + 'style/hippie-style/mixins/'));

  return merge(imgStream, cssStream);
}

// Gather dependencies for tools
function vendor() {
  return src(input.vendor)
    .pipe(plumber())
    .pipe(dest(output.vendor))
}

function overview() {
  watch([input.templates, input.screens, config.frontendData], series(nunjucks, reload));
  // watch(input.style, series(styleLint, style, reload));
  watch(input.style, series(style, reload));
  // watch(input.code, series(codeLint, code, reload));
  watch(input.code, series(code, reload));
  watch(input.fonts, series(fonts, reload));
  watch(input.art.sprites, series(parallel(sprites, style), reload));
  watch([input.art.favicons, input.art.images], series(art, reload));
  watch(config.frontendData, series(json, reload));
}

const assets = parallel(fonts, art, sprites, json, vendor);
const build = series(clean, assets, parallel(nunjucks, style, code));
// const dev = series(clean, assets, parallel(nunjucks, series(styleLint, style), series(codeLint, code)));
const dev = series(clean, assets, parallel(nunjucks, style, code));

exports.lint = parallel(series(style, styleLint), series(code, codeLint));
exports.validate = series(nunjucks, validate);
exports.assets = assets;
exports.build = build;
exports.dev = dev;
exports.serve = series(dev, serve);
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
function customPlumber() {
  return plumber({
    errorHandler: function (err) {
      // Logs error in console
      console.log(err.message);
      // Ends the current pipe, so Gulp watch doesn't break
      this.emit('end');
    }
  });
}