const plumber = require('gulp-plumber');
// const notify = require('gulp-notify');

// function catchErrors(errTitle) {
//   return plumber({
//     errorHandler: notify.onError({
//       // Customizing error title
//       title: errTitle || "GULP GENERAL PROBLEM",
//       message: "<%= error.message %>"
//     })
//   });
// }

function catchErrors() {
  return plumber({
    errorHandler: function (err) {
      // Logs error in console
      console.log(err.message);
      // Ends the current pipe, so Gulp watch doesn't break
      this.emit('end');
    }
  });
}

module.exports = catchErrors;