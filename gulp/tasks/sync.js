const config = require('../config');
const browserSync = require('browser-sync'), server = browserSync.create();

// Automagically reload browsers
function reload(done) {
  server.reload();

  done();
}

// Serve files to the browser
function serve(done) {
  server.init({
    index: config.index,
    open: false,
    server: config.dev
  });

  done();
}

module.exports = {
  serve: serve,
  reload: reload,
};