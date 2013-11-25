var builder = {
  init: function() {
    console.log('builder.js is loaded...')

    // Render template mapping  
    this.questionTemplate = {
      "Menu of Steps": "menu-of-steps-template",
      "Header Text": "header-text-template",
      "Yes-No Question": "yes-no-question-template",
      "Text Box Reply": "text-box-template",
      "Default": "select-question-template"
    }

    var _this = this;

    // Setup click events - YES button
    $('body').on('click', '.work-container .btn-yes', function(e) {
      var $builderPanel = $(this).next();
      var $previewPanel = $(this).closest('.flipper').find('.back').find('.btn-yes-preview').next();
      if ( $(this).next().is(':hidden') ) {
        // load child question template
        _this.renderYesNoChildQuestionContainer("add", $(this));
        $builderPanel.slideDown("200");
        $previewPanel.slideDown("200");
      } else {
        var btnContext = $(this);
        $builderPanel.slideUp("200", function(){
          _this.renderYesNoChildQuestionContainer("remove", btnContext);
        });
        $previewPanel.slideUp("200");
      }
    });

    // Setup click events - NO button
    $('body').on('click', '.work-container .btn-no', function(e) {
      var $builderPanel = $(this).next();
      var $previewPanel = $(this).closest('.flipper').find('.back').find('.btn-no-preview').next();
      if ( $(this).next().is(':hidden') ) {
        _this.renderYesNoChildQuestionContainer("add", $(this));
        $builderPanel.slideDown("200");
        $previewPanel.slideDown("200");
      } else {
        $builderPanel.slideUp("200");
        $previewPanel.slideUp("200");
        _this.renderYesNoChildQuestionContainer("remove", $(this));
      }
    });

    // Setup click events for single group list
    $('body').on('click', '.work-container .list-group .list-group-item', function(e) {

        var listItemAttr = $(this).data('step');
        var $builderPanel = $(this).next();
        var $previewPanel = $(this).closest('.flipper').find('.back').find("[data-step='"+ listItemAttr +"']").next();

        // This logic is for adding a new list-group-item (append to bottom of list group)
        if ($(this).hasClass('list-add-item')) {
          // TODO:
          // we are going to do something else.
          console.log('add another list item entry.');
          return
        }

        if ( $builderPanel.is(':hidden') ) {
          _this.renderMenuListChildQuestion("add", $(this));
          $builderPanel.slideDown("200");
          $previewPanel.slideDown("200");
        } else {
          $builderPanel.slideUp("200");
          $previewPanel.slideUp("200");
          _this.renderMenuListChildQuestion("remove", $(this));
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

    // Click Event for edit title (question header)
    $('body').on('click', '.question-title .glyphicon-pencil', function(e) {
      e.preventDefault();
      var titleContainer = $(this).parent();
      // Display input field
      titleContainer.find('.form-control').show();
      titleContainer.find('.question-btn').show();
      // Hide the pencil icon and title
      titleContainer.find('.qtitle').hide();
      $(this).hide()
    });

    // Click Event for "Done" button located in title input field.
    $('body').on('click', '.question-title .question-btn', function(e) {
      e.preventDefault();
      var titleContainer = $(this).parent();
      var titleEntry = titleContainer.find('.form-control').val();
      var placeholderEntry = titleContainer.find('.form-control').attr('placeholder');
      titleEntry = titleEntry === "" ? placeholderEntry : titleEntry;
      // Populate the title entry with new value
      titleContainer.find('.qtitle').text(titleEntry);
      // Hide input field
      titleContainer.find('.form-control').hide();
      titleContainer.find('.question-btn').hide();
      // Display title and glyphicon 
      titleContainer.find('.qtitle').show();
      titleContainer.find('.glyphicon-pencil').show();
    });

    // Click event for add another parent question
    $('body').on('click', '.add-question-container .add-question', function(e) {
      e.preventDefault();
      console.log('Add Another Question here...');
      // add question container
      _this.renderQuestionBase(true);
      // insert parent question container
      _this.renderParentQuestionContainer();
      // Turn on the option for deleting spawned parent questions.

    });

    // Click event for add another child question
    $('body').on('click', '.panel-child-container .add-child-question-btn', function(e) {
      e.preventDefault();
      var $panelContainer = $(this).closest('.panel-child-container');
      // Append a new question to current panel container.
      $panelContainer.append(_this.template($('#child-question-container-template').html()));
      $panelContainer.find('.question-template').each(function() {
        if ($(this).children().length === 0) {
          $(this).append(_this.template($('#select-question-template').html()));
        }
      });

      // Hide the "Add Another Question" button that is attached
      $(this).closest('.add-child-question-container').hide();
    });

    $('body').on('click', '.panel-child-container .glyphicon-trash', function(e){
      e.preventDefault();
      var $questionContainer = $(this).closest('.child-question-container-template');
      var $panelContainer = $(this).closest('.panel-child-container');
      $questionContainer.slideUp('200', function() {
        $questionContainer.remove();
        // Make sure the Add Another Question button is alway attached
        // to the last child-question-container-template
        if ($panelContainer.children().length === 0) {
          $panelContainer.hide();
          $panelContainer.slideUp("200");
        }
        $panelContainer.find('.child-question-container-template').last().find('.add-child-question-container').show();
      });
    });

    // Click event for Trash button for parent questions
    $('body').on('click', '.question-select-container .glyphicon-trash', function(e) {
      e.preventDefault();
      var $questionContainer = $(this).closest('.question-container');
      $questionContainer.remove();
    });

    // Onclick event for text-box-template
    $('body').on('click', '.text-box-template .glyphicon-pencil', function(e) {
      e.preventDefault();
      var $textLabel = $(this).closest('.text-box-label-controls');
      $textLabel.find('.header-text').hide();
      $textLabel.find('.glyphicon-pencil').hide();
      $textLabel.find('.form-control').show();
      $textLabel.find('.text-box-label-btn').show();
    });

    // Click event for done button (text-box-template)
    $('body').on('click', '.text-box-template .text-box-label-btn', function(e) {
      e.preventDefault();
      $textControls = $(this).closest('.text-box-label-controls');
      var entry = $textControls.find('.form-control').val();
      var placeholderEntry = $textControls.find('.form-control').attr('placeholder');
      entry = entry === "" ? placeholderEntry : entry;
      $textControls.find('.header-text').text(entry);

      $textControls.find('.form-control').hide();
      $textControls.find('.text-box-label-btn').hide();
      $textControls.find('.header-text').show();
      $textControls.find('.glyphicon-pencil').show();
    });

    // Click event for editing the parent title
    $('body').on('click', '.exam-header-title .glyphicon-pencil', function(e) {
      e.preventDefault();
      console.log('this works!');
      $examTitle = $(this).closest('.question-header-parent').find('.exam-header-title');
      $examEdit = $(this).closest('.question-header-parent').find('.exam-edit-title');
      $examTitle.hide();
      $examEdit.show();
    });

    $('body').on('click', '.exam-edit-title .exam-title-edit-btn', function(e) {
      e.preventDefault();
      $examTitle = $(this).closest('.question-header-parent').find('.exam-header-title');
      $examEdit = $(this).closest('.question-header-parent').find('.exam-edit-title');

      var entry = $examEdit.find('.form-control').val();
      var placeholderEntry = $examEdit.find('.form-control').attr('placeholder');
      console.log('entry is ...', entry);
      entry = entry === "" ? placeholderEntry : entry;
      $examTitle.find('h3').text(entry);
      $examEdit.hide();
      $examTitle.show();
    });

    // Let's begin to render the inital question on the page.
    // Render the navbar
    this.renderNavbar();

    // Render the exam title header
    this.renderExamHeader();

    // Render the question base markup
    this.renderQuestionBase(false);

    // Render "Add Another Question" button
    this.renderAddAnotherQuestion();

    // Initialize the page with a parent question container
    this.renderParentQuestionContainer();
  },

  renderNavbar: function() {
    $('body').prepend(this.template($('#navbar-template').html()));
  },

  renderExamHeader: function() {
    $('.main-container').append(this.template($('#question-exam-header-template').html()));
  },

  renderQuestionBase: function(enableDelete) {
    $('.main-container').append(this.template( $('#question-base-template').html(), {enableDelete: enableDelete} ));
  },

  renderAddAnotherQuestion: function() {
    $('body').append(this.template($('#add-another-question-template').html()));
  },

  renderParentQuestionContainer: function() {
    // Includes both rendering the builder and preview question containers.
    var $questionTemplate = $('.work-container .question-template');
    var _this = this;
    $questionTemplate.each(function(item) { 
      if ($(this).children().length === 0) {
        $(this).append(_this.template($('#select-question-template').html()));
      }
    });

    var $previewTemplate = $('.preview-container .question-template');
    $previewTemplate.each(function(item) { 
      if ($(this).children().length === 0) {
        $(this).append(_this.template($('#preview-question-template').html()));
      }
    });
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

  renderChildQuestion: function(questionTemplate, context) {
    var $childTarget = context.closest('.child-question-container-template');
    $childTarget.find('.question-template').empty();
    $childTarget.find('.question-template').append(this.template($('#'+questionTemplate).html()));

    // Which question template are we dealing with...
    // This will allow us to tell which preview target to construct.

    var previewTemplate = questionTemplate + '-preview';
    if (questionTemplate === 'menu-of-steps-template') {

      var listItemAttr = $childTarget.prev().data('step');
      var $previewTarget = context.closest('.flipper').find('.back').find("[data-step='"+ listItemAttr +"']").next(); 
      $previewTarget.find('.question-template').empty();
      $previewTarget.find('.question-template').append(this.template($('#'+previewTemplate).html()));

    } else if (questionTemplate === 'yes-no-question-template') {
      // Is this the Yes or No button.    
    }

  },

  renderYesNoChildQuestionContainer: function(action, context) {
    var $builderChildPanel = context.next('.panel-child-container');

    // Determine which button to display if context is from YES/NO buttons
    if (context.hasClass('btn-no')) {
      var $previewChildPanel = context.closest('.flipper').find('.back').find('.btn-no-preview').next();
    } else if (context.hasClass('btn-yes')) {
      var $previewChildPanel = context.closest('.flipper').find('.back').find('.btn-yes-preview').next();
    } else {
      // This is a list-item context 
      var $previewChildPanel = context;
    }

    if (action === 'add') {
      if (context.next().children().length === 0) {
        $builderChildPanel.append(this.template($('#child-question-container-template').html()));
        $builderChildPanel.find('.question-template').append(this.template($('#select-question-template').html()));

        $previewChildPanel.append(this.template($('#child-question-container-template-preview').html()));
        $previewChildPanel.find('.question-template').append(this.template($('#select-question-template').html()));
      }

    } else if (action === 'remove') {
      //$builderChildPanel.empty();
      //$previewChildPanel.empty();
    }
  },

  renderMenuListChildQuestion: function(action, context) {
    var listItemAttr = context.data('step');
    var $builderChildPanel = context.next();
    var $previewChildPanel = context.closest('.flipper').find('.back').find("[data-step='"+ listItemAttr +"']").next();

    if (action === 'add') {

      // Only append the new child question if there are no contents in the panel-child-container.
      if (context.next().children().length === 0) {
        $builderChildPanel.append(this.template($('#child-question-container-template').html()));
        $builderChildPanel.find('.question-template').append(this.template($('#select-question-template').html()));

        // Render the question in preview mode
        $previewChildPanel.append(this.template($('#child-question-container-template-preview').html()));
        $previewChildPanel.find('.question-template').append(this.template($('#select-question-template').html()));
      }

    } else if (action === 'remove') {
      //context.next().empty();
    }
  },

  renderSelectQuestion: function(action, context) {
    var dataStep = context.data('step');
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