'use strict';
module.exports = function(config) {
  config.set({

    basePath: './',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-strap/dist/angular-strap.js',
      'bower_components/angular-strap/dist/angular-strap.tpl.js',
      'bower_components/moment/moment.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/angular-ui-sortable/sortable.js',
      'bower_components/ace-builds/src-min-noconflict/ace.js',
      'bower_components/ace-builds/src-min-noconflict/mode-markdown.js',
      'bower_components/angular-ui-ace/ui-ace.js',
      'bower_components/ng-tags-input/ng-tags-input.js',
      'bower_components/lodash/dist/lodash.js',
      'src/app.js',
      'src/services/*.js',
      'src/controllers/*.js',
      'test/unit/httpMocks.js',
      'test/unit/noteListCtrlSpec.js'
      //'test/unit/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ]
  });
};
