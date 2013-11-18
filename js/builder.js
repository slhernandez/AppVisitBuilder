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

    // Setup click events - YES button
    $('body').on('click', '.work-container .btn-yes', function(e) {
      if ( $(this).next().is(':hidden') ) {
        // load child question template
        _this.renderChildQuestionContainer("add", $(this));
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200", function(){
          _this.renderChildQuestionContainer("remove", $(this));
        });
      }
    });

    // Setup click events - NO button
    $('body').on('click', '.work-container .btn-no', function(e) {
      if ( $(this).next().is(':hidden') ) {
        _this.renderChildQuestionContainer("add", $(this));
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200");
        _this.renderChildQuestionContainer("remove", $(this));
      }
    });

    // Setup click events for single group list
    $('body').on('click', '.work-container .list-group .list-group-item', function(e) {

        if ($(this).hasClass('list-add-item')) {
          // TODO:
          // we are going to do something else.
          console.log('add another list item entry.');
          return
        }

        if ( $(this).next().is(':hidden') ) {
          _this.renderChildQuestionContainer("add", $(this));
          $(this).next().slideDown("200");
        } else {
          $(this).next().slideUp("200");
          _this.renderChildQuestionContainer("remove", $(this));
        }
    });

    // Click event for the Parent Question dropdown menu 
    // Parent question selection
    $('body').on('click', '.work-heading .dropdown-menu li', function(e) {
      e.preventDefault();
      // Update button label
      var selectedItem = $(this).text();
      $(this).parent().prev().prev().text(selectedItem);
      // Render the builder question
      _this.renderParentQuestion(_this.questionTemplate[selectedItem], $(this));
    });

    // Click event for the child question dropdown menu
    // Child question selection
    $('body').on('click', '.work-container .dropdown-menu li', function(e) {
      e.preventDefault();
      // Update button label
      var selectedItem = $(this).text();
      $(this).parent().prev().prev().text(selectedItem);
      _this.renderChildQuestion(_this.questionTemplate[selectedItem], $(this));
    });

    // Add Another Question click event 
    $('body').on('click', '.add-question-container .add-question', function(e) {
      e.preventDefault();
      alert('this worked!');
      // Create a new 
    });

    // Render the navbar
    this.renderNavbar();

    // Render the question base markup
    this.renderQuestionBase();

    // Initialize the page with a parent question container
    this.renderParentQuestionContainer();
  },

  renderNavbar: function() {
    $('body').append(this.template($('#navbar-template').html()));
  },

  renderQuestionBase: function() {
    $('body').append(this.template($('#question-base-template').html()));
  },

  renderParentQuestionContainer: function(init) {
    // Includes both rendering the builder and preview question containers.
    $('.work-heading').append(this.template($('#parent-question-menu-template').html()));    
    $('.work-container').append(this.template($('#parent-question-container-template').html()));
    $('.work-container .question-template').append(this.template($('#select-question-template').html()));

    $('.preview-heading').append(this.template($('#preview-heading-template').html()));
    $('.preview-container').append(this.template($('#parent-question-container-template').html()));
    $('.preview-container .question-template').append(this.template($('#preview-question-template').html()));
  },

  renderParentQuestion: function(questionTemplate, context) {
    var $flipTarget = context.closest('.flipper');
    var $builderTarget = $flipTarget.find('.work-container');
    var $previewTarget = $flipTarget.find('.preview-container');

    // Remove any existing question markup.
    $builderTarget.find('.question-template').empty();
    $previewTarget.find('.question-template').empty();

    // Render Builder Template
    $builderTarget.find('.question-template').append(this.template($('#'+questionTemplate).html()));
    // Render Preview Template
    var previewTemplate = questionTemplate + '-preview';
    $previewTarget.find('.question-template').append(this.template($('#'+previewTemplate).html()));

  },

  renderChildQuestionContainer: function(action, context) {
    if (action === 'add') {
      var $childPanel = context.next('.panel-child-container');
      $childPanel.append(this.template($('#child-question-container-template').html()));
      $childPanel.find('.question-template').append(this.template($('#select-question-template').html()));
    } else if (action === 'remove') {
      if ( context.hasClass('btn-no') ) {
        var $childPanel = context.next('.panel-child-container');
      } else if (context.hasClass('list-group-item')) {
        var $childPanel = context.next();
      } else {
        var $childPanel = context;
      }
      $childPanel.empty();
    }
  },

  renderChildQuestion: function(questionTemplate, context) {
      var $childTarget = context.closest('.panel-child-container');
      $childTarget.find('.question-template').empty();
      $childTarget.find('.question-template').append(this.template($('#'+questionTemplate).html()));
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