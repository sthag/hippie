const { src } = require('gulp');
const config = require('../config');
const plumber = require('../modules/plumber');
const htmlValidator = require('gulp-w3c-html-validator');

function validate() {
  return src(config.dev + '**/*.html')
    .pipe(plumber())
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter());
}

module.exports = validate;