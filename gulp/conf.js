// gulp/conf.babel.js



/* Load Plugins & Dependencies
–––––––––––––––––––––––––––––––––––––––––––––––––– */

import {gulpUtil as util} from 'gulp-util';



/* Main Project Paths
–––––––––––––––––––––––––––––––––––––––––––––––––– */

export var paths = {
  src   : 'app',
  dist  : 'dist',
  tmp   : '.tmp',
  test  : 'test',
  incl  : '.'
};



/* File Sources
–––––––––––––––––––––––––––––––––––––––––––––––––– */

export var src = {

  build   : 'dist/**/*',
  fonts   : 'app/fonts/**/*',
  html    : 'app/*.html',
  images  : 'app/images/**/*',
  scripts : 'app/scripts/**/*.js',
  styles  : 'app/styles/*.scss',
  tests   : 'test/spec/**/*.js',
  extras  : ['app/*.*', '!app/*.html']

};



/* Wiredep Dependencies
–––––––––––––––––––––––––––––––––––––––––––––––––– */

export var wiredep = {

  directory: 'bower_components'

};



/* Gulp Error Handler
–––––––––––––––––––––––––––––––––––––––––––––––––– */

export function errorHandler (title) {
  'use strict';

  return (err) => {
    util.log(util.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };

};
