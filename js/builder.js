var builder = {
  init: function() {
    console.log('builder.js is loaded...')
    var _this = this;
    // Setup events
    $('.btn-yes').on('click', function(e) {
      if ( $(this).next().is(':hidden') ) {
      // load the YesNoQuestion template
      _this.renderYesNoQuestion("add");
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200", function(){
          _this.renderYesNoQuestion("remove");
        });
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
  },

  renderYesNoQuestion: function(action) {
    if (action === 'add') {
      $('.panel-child-container').append(_.template($('#yes-no-question').html())); 
    } else if (action === 'remove') {
      $('.yesno-template').remove();
    }
  }

}