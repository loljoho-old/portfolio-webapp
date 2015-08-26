(function(main) {
  'use strict';

  // Pass global jQuery obj as param
  main(window.jQuery, window, document);

}(function($, window, document) {
  'use strict';

  // Locally scoped $

  // Document Ready
  // -------------------------------
  $(function() {



    // Retrieve Brand Text
    // -------------------------------

    getResume().done(function(data) {
      //$('.navbar-brand').text(data.title);
    });

  });



  // Return Ajax Request Promise
  // -------------------------------

  function getResume() {
    return $.ajax({
      url       : "data/test.json",
      type      : 'GET',
      dataType  : 'json'
    });
  }



}));
