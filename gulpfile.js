'use strict';

var gulp = require('gulp');
var refresh = require('gulp-livereload');
var livereload = require('tiny-lr');
var server = livereload();


gulp.task('lr-server', function(cb) {
  server.listen(35729, function(err) {
    if (err) return console.log(err);
  });
});

gulp.task('scripts', function(cb) {
  return gulp.src('public/*.js')
    .pipe(refresh(server));
});

gulp.task('styles', function(cb) {
  return gulp.src('public/*.css')
    .pipe(refresh(server));
});

gulp.task('default', function(cb) {
  gulp.run('lr-server');

  gulp.watch('public/*.js', function(event) {
    gulp.run('scripts');
  });

  gulp.watch('public/*.css', function(event) {
    gulp.run('styles');
  });

});
