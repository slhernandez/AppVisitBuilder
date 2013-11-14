var builder = {
  init: function() {
    console.log('builder.js is loaded...')

    // Setup events
    $('.btn-yes').on('click', function(e) {
      if ( $(this).next().is(':hidden') ) {
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200");
      }
    });

    $('.btn-no').on('click', function(e) {
      if ( $(this).next().is(':hidden') ) {
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200");
      }
    });

    $('.dropdown-menu').on('click', 'li', function(e) {
      e.preventDefault();
      console.log('selected ', $(this).text());
      // Update button label
      var selectedItem = $(this).text();
      $(this).parent().prev().prev().text(selectedItem);
      console.log('load the question form...');

    });


  }
}