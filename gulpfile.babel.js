// generated on 2015-08-26 using generator-gulp-webapp 1.0.3
// modified by Jonathan Ho



/* Load Plugins & Dependencies
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import gulp from 'gulp';
import del from 'del';
import {stream as wiredep} from 'wiredep';


// Load Gulp-* Plugins
// ------------------------------

import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();


// Comment Wrapper
// ------------------------------

import * as common from './gulp/common';
const commentHeader = common.createComments($.util);


// Configuration
// ------------------------------

import * as conf from './gulp/conf';


// Browser-Sync
// ------------------------------

import browserSync from 'browser-sync';
const reload = browserSync.reload;



/* Styles
–––––––––––––––––––––––––––––––––––––––––––––––––– */

const sassSyncOptions = {
  outputStyle   : 'expanded',
  precision     : 10,
  includePaths  : [conf.paths.incl]
};

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('styles', () => {
  $.util.log($.util.colors.blue('Styles task...'));
  return gulp.src(conf.src.styles)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync(sassSyncOptions).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});



/* Scripts
–––––––––––––––––––––––––––––––––––––––––––––––––– */

function lint(files, options) {
  $.util.log($.util.colors.yellow('Scripts task...'));
  return () => {
    return gulp.src(files)
      .pipe(reload({
        stream  : true,
        once    : true
      }))
      .pipe($.eslint(options))
      .pipe($.eslint.format('eslint-stylish'))
      //.pipe($.eslint.reporter())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

const testLintOptions = {
  env: {
    mocha: true
  }
};


// Lint Tasks
// -------------------------------

gulp.task('lint', lint(conf.src.scripts));

gulp.task('lint:test', lint(conf.src.tests));



/* Templates
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({
    searchPath: [
      conf.paths.tmp,
      conf.paths.app,
      conf.paths.incl
    ]
  });

  return gulp.src(conf.src.html)
    .pipe(assets)
    .pipe($.if('*.js', $.uglify(), $.header(commentHeader)))
    .pipe($.if('*.css', $.minifyCss({
      compatibility: '*'
    }), $.header(commentHeader)))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({
      conditionals: true,
      loose: true
    })))
    .pipe($)
    .pipe(gulp.dest(conf.paths.dist));
});




/* Images
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('images', () => {
  $.util.log($.util.colors.blue('Images task...'));
  return gulp.src(conf.src.images)
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});



/* Fonts
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('fonts', () => {
  $.util.log($.util.colors.gray('Fonts task...'));
  return gulp.src(
    require('main-bower-files')({
      filter: '**/*.{eot,svg,ttf,woff,woff2}'
    }).concat(conf.src.fonts))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});



/* Everything Else
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('extras', () => {
  $.util.log($.util.colors.blue('Extras task...'));
  return gulp.src(conf.src.extras, {
    dot: true
  }).pipe(gulp.dest(conf.paths.dist));
});



/* Clean Task
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('clean', del.bind(null, [conf.paths.tmp, conf.paths.dist]));



/* Serve Task
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('serve', ['styles', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [conf.paths.tmp, conf.paths.src],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/scripts/**/*.js', ['lint']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// Serve from dist/
// -------------------------------
gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [conf.paths.dist]
    }
  });
});

// Serve Test
// -------------------------------
gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: conf.paths.test,
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);

});



/* Inject Bower Dependencies
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('wiredep', () => {
  $.util.log($.util.colors.blue('Wiredep task...'));
  gulp.src(conf.src.styles)
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe($.header(commentHeader))
    .pipe(gulp.dest('app/styles'));

  gulp.src(conf.src.html)
    .pipe(wiredep({
      exclude: ['jquery'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe($.header(commentHeader))
    .pipe(gulp.dest(conf.paths.src));
});



/* Build Task
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  $.util.log($.util.colors.orange('Build task...'));
  return gulp.src(conf.src.build)
    .pipe($.size({
      title: 'build',
      gzip: true
    }));
});



/* Default Task
–––––––––––––––––––––––––––––––––––––––––––––––––– */

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
