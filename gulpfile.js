var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade        = require('gulp-jade');
var image       = require('gulp-image');
var cleanCSS    = require('gulp-clean-css');
var uglify      = require('gulp-uglify');
var pump        = require('pump');
var runSequence = require('run-sequence');


var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', ['sass'], function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['build'], function() {
    browserSync({
        server: {
            baseDir: 'site'
        }
    });
});

gulp.task('build', function(done) {
  runSequence('jekyll-build', 'sass', 'compress', done);
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('app/_assets/css/main.sass')
        .pipe(sass({
            includePaths: ['sass'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('site/assets/css/'))
        // .pipe(gulp.dest('site/assets/css'))
});

gulp.task('compress', function(cb) {
    pump([
            gulp.src('app/_assets/js/*.js'),
            uglify(),
            gulp.dest('site/assets/js/')
        ],
        cb
    );
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('app/_assets/js/*.js', ['compress']);
    gulp.watch('app/_jadefiles/*.jade', ['jade', 'jekyll-rebuild']);
    gulp.watch(['app/*.html', 'app/_layouts/*.html', 'app/_posts/*'], ['jekyll-rebuild']);
    gulp.watch('app/_assets/css/*.sass', ['sass']);
    gulp.watch('app/_assets/js/*.js', ['compress']);
    gulp.watch('app/manifest.json',['manifest-transfer']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
