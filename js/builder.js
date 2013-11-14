var builder = {
  init: function() {
    console.log('builder.js is loaded...')
    var _this = this;
    // Setup events
    $('.btn-yes').on('click', function(e) {
      if ( $(this).next().is(':hidden') ) {
        // load the YesNoQuestion template
        _this.renderYesNoQuestion("add", $(this));
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200", function(){
        _this.renderYesNoQuestion("remove", $(this));
        });
      }
    });

    $('.btn-no').on('click', function(e) {
      if ( $(this).next().is(':hidden') ) {
        _this.renderSelectQuestion("add", $(this));
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200");
        _this.renderSelectQuestion("remove", $(this));
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

  renderYesNoQuestion: function(action, context) {
    if (action === 'add') {
      var $panel = context.next('.panel-child-container');
      $panel.append(this.template($('#yes-no-question-template').html())); 
    } else if (action === 'remove') {
      var $panel = context;
      $panel.find('.yesno-template').remove();
    }
  },

  renderSelectQuestion: function(action, context) {
    var $panel = context.next('.panel-child-container');
    if (action === 'add') {
      $panel.append(this.template($('#select-question-template').html()));
    } else if (action === 'remove') {
      $panel.find('.question-template').remove();
    }
  },

  // Extend underscore's template() to allow inclusions
  template: function(str, data) {
    // match "<% include template-id %>"
    return _.template(
      str.replace(
        /<%\s*include\s*(.*?)\s*%>/g,
        function(match, templateId) {
          var el = document.getElementById(templateId);
          return el ? el.innerHTML : '';
        }
      ),
      data
    );
  }

}