var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cp = require('child_process');
var jade = require('gulp-jade');
var image = require('gulp-image');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn(jekyll, ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jade', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/*
 * Utkarsh copied all this stuff from
 */

gulp.task('jade', function() {
    return gulp.src('_jadefiles/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('_includes'))
});


/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function() {
    return gulp.src('assets/css/main.sass')
        .pipe(sass({
            includePaths: ['/assets/css/*.css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(gulp.dest('assets/css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
    gulp.watch('assets/js/*.js', ['compress']);
    gulp.watch('assets/images/*', ['image']);
    gulp.watch('_jadefiles/*.jade', ['jade', 'jekyll-rebuild']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
    gulp.watch('assets/css/*.sass', ['sass']);
    gulp.watch('manifest.json',['manifest-transfer']);
});

gulp.task('image', function() {
    gulp.src('assets/images/*')
        .pipe(image())
        .pipe(gulp.dest('_site/assets/images/'));
});

gulp.task('compress', function(cb) {
    pump([
            gulp.src('assets/js/*.js'),
            uglify(),
            gulp.dest('_site/assets/js/')
        ],
        cb
    );
});

gulp.task('manifest-transfer', function(){
  gulp.src('manifest.json')
      .pipe(gulp.dest('_site/'));
});


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['image', 'compress', 'browser-sync', 'watch','jade','manifest-transfer']);
