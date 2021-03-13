// Use hippie
// const hippie = require('hippie/hippie');

// Setup project
const config = require('./gulp/config');

const hello = require('./gulp/tasks/hello');
const plumber = require('./gulp/modules/plumber');
const { serve, reload } = require('./gulp/tasks/sync');
const clean = require('./gulp/tasks/clean');
const validate = require("./gulp/tasks/validate");

// Gulp requirements
const { watch, series, parallel } = require('gulp');
const { src, dest } = require('gulp');

const fs = require('fs');

const nunjucksRender = require('gulp-nunjucks-render');
// const nunjucks = require('gulp-nunjucks');
const data = require('gulp-data');
const jsonConcat = require('gulp-json-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sassLint = require('gulp-sass-lint');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const pump = require('pump');
const cached = require('gulp-cached');
// const remember = require('gulp-remember');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const gulpIf = require('gulp-if');
const changed = require('gulp-changed');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith');
// const babel = require('gulp-babel');
// const buffer = require('vinyl-buffer');
// const imagemin = require('gulp-imagemin');
const useref = require('gulp-useref');

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
  data: config.dev + 'json',
  style: config.dev + 'css',
  code: config.dev + 'js',
  fonts: config.dev + 'fonts',
  art: config.dev + 'art',
  vendor: config.dev + 'vendor'
};

// Show demo content if configured
if (config.demo === true) {
  config.index = 'demo.html';
  config.templateData = config.src + 'templates/demo/data.json';
} else {
  config.frontendData = [config.src + 'data/**/*.json', '!' + config.src + 'data/demo.json'];
}

// Create tasks

// Concatenate JSON files
function json() {
  return src(config.frontendData)
    .pipe(plumber())
    .pipe(jsonConcat('db.json', function (data) {
      return new Buffer.from(JSON.stringify(data));
    }))
    .pipe(dest(output.data));
}

function manageEnvironment(environment) {
  environment.addFilter('slug', function (str) {
    return str && str.replace(/\s/g, '-', str).toLowerCase();
  });

  environment.addGlobal('hippie', config.hippie);
}

// function getDataForTemplates (file) {
//   const template = JSON.parse(fs.readFileSync(config.templateData));
//   const hippie = config.hippie;
//   // console.log(file.relative);
//   return { hippie, template };
// }
function getDataForTemplates() {
  const data = JSON.parse(fs.readFileSync(config.templateData));
  return { data };
}

// Transpile HTML
function nunjucks() {
  return src(input.screens)
    .pipe(plumber())
    // TODO only add data to pipe for necessary files
    .pipe(data(getDataForTemplates))
    .pipe(nunjucksRender({
      path: input.templates,
      envOptions: {
        trimBlocks: true
      },
      manageEnv: manageEnvironment
    }))
    .pipe(dest(config.dev));
}

// This is for the looks
function style() {
  return src(input.style)
    .pipe(plumber())
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
  const dir = config.rep;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let file = fs.createWriteStream(config.rep + 'sass-lint.html');
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
    // concat(config.hippie.jsFile + 'main.js'),
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
    .pipe(dest(config.dev))

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
//     .pipe(changed(config.dev))
//     .pipe(dest(config.dev))
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

// TODO for distribution
function code2() {
  return src(config.dev + '**/*.html')
    .pipe(useref())
    .pipe(cached('useref'))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(dest('dist'));
}



function overview() {
  watch([input.templates, input.screens, config.frontendData + 'data/**/*.json'], series(nunjucks, reload));
  // watch(input.style, series(styleLint, style, reload));
  watch(input.style, series(style, reload));
  // watch(input.code, series(codeLint, code, reload));
  watch(input.code, series(code, reload));
  watch(input.fonts, series(fonts, reload));
  watch(input.art.sprites, series(sprites, style, reload));
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
exports.dist = series(clean, assets, parallel(nunjucks, style), code2);
exports.default = series(dev, serve, overview);

exports.hello = hello;
