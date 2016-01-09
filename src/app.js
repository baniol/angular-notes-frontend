'use strict';

angular.module('NgNotes', ['ngResource', 'ui.router', 'mm.foundation', 'ui.sortable', 'ui.ace', 'ngTagsInput'])

  .run(['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
      if ($rootScope.currentUser) {
        $rootScope.loggedin = true;
      }
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/', '/notes');
    $urlRouterProvider.when('', '/notes');
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/views/home.html',
        controller: 'HomeCtrl'
      })
      .state('notes', {
        url: '/notes',
        resolve: {
          //This can be injected into controller
          //But there the main purpose is to resove a pullNotes promise
          notesCollection: function (Notes) {
            return Notes.pullNotes();
          },
          tagsCollection: function (Tags) {
            return Tags.pullTags();
          }
        },
        views: {
          '': {
            templateUrl: '/views/notes.html'
          },
          'list@notes': {
            templateUrl: '/views/note-list.html',
            controller: 'NoteListCtrl'
          },
          'tagcloud': {
            templateUrl: '/views/tag-cloud.html',
            controller: 'TagCtrl'
          }
        },
        // Check if user is authorized to view the note list
        onEnter: function (Auth) {
          Auth.checkAuth();
        }
      })
      .state('notes.details', {
        url: '/:id',
        views: {
          '': {
            templateUrl: '/views/notes.html'
          },
          'details@notes': {
            templateUrl: '/views/note-details.html',
            controller: 'NoteDetailsCtrl'
          }
        }
      })
      .state('tags', {
        url: '/tags',
        templateUrl: '/views/tags.html',
        controller: 'ManageTagsCtrl',
        resolve: {
          tagsCollection: function (Tags) {
            return Tags.pullTags();
          }
        },
      })
      .state('login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '/views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('editProfile', {
        url: '/editprofile',
        templateUrl: '/views/editprofile.html',
        controller: 'EditProfileCtrl'
      })
      .state('forgotPassword', {
        url: '/forgot',
        templateUrl: '/views/forgotpassword.html',
        controller: 'ForgotPasswordCtrl'
      })
      .state('resetPassword', {
        url: '/resetpassword?token',
        templateUrl: '/views/resetpassword.html',
        controller: 'ResetPasswordCtrl'
      });
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q, $window, $location) {
      return {
        request: function(config) {
          if ($window.localStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401) {
            // @TODO code repetition - Auth logout
            delete $window.localStorage.token;
            $rootScope.currentUser = null;
            $location.path('/login');
          }
          return $q.reject(response);
        }
      };
    });
  })
  .constant('apiUrl', 'http://notes-api.baniowski.net')
  .constant('resetPasswordUrl', 'http://localhost:3000/#');


