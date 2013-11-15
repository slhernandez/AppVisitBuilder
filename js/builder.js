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
    $('.work-container').on('click', '.btn-yes', function(e) {
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
    $('.work-container').on('click', '.btn-no', function(e) {
      if ( $(this).next().is(':hidden') ) {
        _this.renderChildQuestionContainer("add", $(this));
        $(this).next().slideDown("200");
      } else {
        $(this).next().slideUp("200");
        _this.renderChildQuestionContainer("remove", $(this));
      }
    });

    // Setup click events for single group list
    $('.work-container').on('click', '.list-group .list-group-item', function(e) {

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
    $('.work-heading').on('click', '.dropdown-menu li', function(e) {
      e.preventDefault();
      // Update button label
      var selectedItem = $(this).text();
      $(this).parent().prev().prev().text(selectedItem);
      _this.renderParentQuestion(_this.questionTemplate[selectedItem], $(this));
    });

    // Click event for the child question dropdown menu
    // Child question selection
    $('.work-container').on('click', '.dropdown-menu li', function(e) {
      e.preventDefault();
      // Update button label
      var selectedItem = $(this).text();
      $(this).parent().prev().prev().text(selectedItem);
      _this.renderChildQuestion(_this.questionTemplate[selectedItem], $(this));
    });

    // Initialize the page with a parent question container
    this.renderParentQuestionContainer();
  },

  renderParentQuestionContainer: function(init) {
    $('.work-heading').append(this.template($('#parent-question-menu-template').html()));    
    $('.work-container').append(this.template($('#parent-question-container-template').html()));
    $('.work-container .question-template').append(this.template($('#select-question-template').html()));

    $('.preview-heading').append(this.template($('#preview-heading-template').html()));
    $('.preview-container').append(this.template($('#parent-question-container-template').html()));
    $('.preview-container .question-template').append(this.template($('#preview-question-template').html()));
  },

  renderParentQuestion: function(questionTemplate, context) {
    var $builderTarget = context.closest('.work-heading').next();
    $builderTarget.find('.question-template').empty();
    $builderTarget.find('.question-template').append(this.template($('#'+questionTemplate).html()));
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