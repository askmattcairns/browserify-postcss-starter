const gulp       = require('gulp')
    , connect    = require('gulp-connect')
    , babelify   = require('babelify')
    , browserify = require('browserify')
    , buffer     = require('vinyl-buffer')
    , gutil      = require('gulp-util')
    , merge      = require('merge')
    , rename     = require('gulp-rename')
    , source     = require('vinyl-source-stream')
    , sourcemaps = require('gulp-sourcemaps')

// Copy the assets into build
gulp.task('assets', function() {
  return gulp.src('./assets/**/*')
          .pipe(gulp.dest('./build/'))
})

// Javascript bundling using browserify
function bundle(bundler) {
  bundler
    .bundle()
    .pipe(source('./src/main.js'))
    .pipe(buffer())
    .pipe(rename('bundle.js'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./maps/'))
    .pipe(gulp.dest('./build/'))
    .pipe(connect.reload())
}

gulp.task('bundle', function() {
  let bundler = browserify('./src/main.js')
        .transform(babelify, {presets : ['es2015']})

  bundle(bundler)
})

// CSS Processing using postcss
gulp.task('css', function() {
  const postcss    = require('gulp-postcss')

  return gulp.src('src/css/site.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([require('postcss-import'), require('autoprefixer')]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload())
})

// Copy the index file to the build directory
gulp.task("html", function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('./build/'))
    .pipe(connect.reload())
})

// Create a connect server
gulp.task("serve", function() {
  connect.server({
    root: 'build',
    livereload: true
  })
})

// Watch for changes
gulp.task("watch", function() {
  gulp.watch(['./assets/**/*'], ['assets'])
  gulp.watch(['./src/**/*.html'], ['html'])
  gulp.watch(['./src/css/**/*.css'], ['css'])
  gulp.watch(['./src/**/*.js'], ['bundle'])
})

// Default task to run everything
gulp.task('default', ['assets', 'bundle', 'css', 'html', 'serve', 'watch'])