function hello (cb) {
  console.log('He Stephan', cb);
  cb();
}

module.exports = hello;