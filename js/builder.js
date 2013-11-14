var builder = {
  init: function() {
    console.log('builder.js is loaded...')

    // Render template mapping  
    this.questionTemplate = {
      "Menu of Steps": "menu-of-steps-template",
      "Header Text": "select-question-template",
      "Yes-No Question": "yes-no-question-template",
      "Default": "select-question-template"
    }

    var _this = this;

    // Setup click events
    $('.work-container').on('click', '.btn-yes', function(e) {
      if ( $(this).next().is(':hidden') ) {
        // load child question template
        //_this.renderYesNoQuestion("add", $(this));
        _this.renderChildQuestionContainer("add", $(this));
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200", function(){
        //_this.renderYesNoQuestion("remove", $(this));
        });
      }
    });

    $('.work-container').on('click', '.btn-no', function(e) {
      if ( $(this).next().is(':hidden') ) {
        _this.renderSelectQuestion("add", $(this));
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200");
        _this.renderSelectQuestion("remove", $(this));
      }
    });

    // Click event for the dropdown menu 
    // Parent Question selection
    $('.work-heading').on('click', '.dropdown-menu li', function(e) {


      e.preventDefault();
      console.log('selected ', $(this).text());
      // Update button label
      var selectedItem = $(this).text();
      $(this).parent().prev().prev().text(selectedItem);
      console.log('load the question form...');
      _this.renderParentQuestion(_this.questionTemplate[selectedItem], $(this));

    });

    // Initialize the page with a parent question container
    this.renderParentQuestionContainer();
  },

  renderParentQuestionContainer: function(init) {
    $('.work-heading').append(this.template($('#parent-question-menu-template').html()));    
    $('.work-container').append(this.template($('#parent-question-container-template').html()));
    $('.work-container .question-template').append(this.template($('#select-question-template').html()));
  },

  renderParentQuestion: function(questionTemplate, context) {
    var $questionTarget = context.closest('.work-heading').next();
    $questionTarget.find('.question-template').empty();
    $questionTarget.find('.question-template').append(this.template($('#'+questionTemplate).html()));
  },

  renderChildQuestionContainer: function(action, context) {
    var $childPanel = context.next('.panel-child-container');
    if (action === 'add') {
      $childPanel.append(this.template($('#child-question-container-template').html()));
      $childPanel.append(this.template($('#select-question-template').html()));

    } else if (action === 'hide') {
    }
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