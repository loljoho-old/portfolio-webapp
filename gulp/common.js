import * as commentWrapper from './commentWrapper';


// Export default.createComments()
// ------------------------------

export function createComments (gutil) {

  var comments = [
      'Copyright (c) 2015 Jonathan Ho',
      'MIT License',
      'For original copyright information, refer to source',
      'https://github.com/loljoho/joho-portfolio',
      'Compiled on ' + gutil.date('mmm d, yyyy h:MM:ss TT Z')
  ];

  return commentWrapper.wrap(comments);
  //  return commentWrapper.wrap(comments);

};
