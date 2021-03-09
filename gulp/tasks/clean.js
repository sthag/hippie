const config = require('../config');
const del = require('del');

// Clean output folders
function clean() {
  return del([config.dev + '**', config.rep + '**', config.dpl + '**']);
}

module.exports = clean;