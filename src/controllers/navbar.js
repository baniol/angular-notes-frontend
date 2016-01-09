'use strict';
angular.module('NgNotes')
  .controller('NavbarCtrl', function($rootScope, $scope, $message, $location, $modal, Auth, Tags, $element) {

    var resetSearch = function () {
      $rootScope.sideVisible = false;
      $rootScope.$broadcast('tagFilter', null);
      $rootScope.$broadcast('searchString', null);
    };

    //var tags = Tags.getTags();
    // @TODO temporary !!!
    setTimeout(function () {
      var tags = Tags.getTags();
      $scope.tags = [];
      if (tags && tags.length > 0) {
        tags.forEach(function (t) {
          $scope.tags.push('#' + t.text);
        });
      }
    }, 1000);
    //$scope.tags = Tags.getTags();
    //console.log($scope.tags);

    $scope.logout = function() {
      $rootScope.loggedin = false;
      $rootScope.sideVisible = false;
      Auth.logout();
      $location.path('/login');
      $message('You have been logged out.');
    };
    // Fix for mm.foundation.offcanvas issue:
    // https://github.com/pineconellc/angular-foundation/issues/172
    $scope.toggleOffCanvas = function (e) {
      e.preventDefault();
      $rootScope.sideVisible = !$rootScope.sideVisible;
    };

    $scope.newNote = function (e) {
      e.preventDefault();
      $rootScope.$broadcast('newNote');
      $rootScope.sideVisible = false;
    };

    //$scope.$on('loadTags', function (tags) {
      //console.log(tags);
    //});

     //$scope.$on('openTagCloud', function () {
     //});
     $scope.openTagCloud = function (e) {
      e.preventDefault();
      //$rootScope.$broadcast('openTagCloud');
      var modalInstance = $modal.open({
        templateUrl: 'views/tag-cloud.html',
        controller: 'TagCtrl'
      });
    };

    $scope.search = function (event) {
      var value = event.target.value;
      // Show clear icon in search input
      if (value.length > 0) {
        $scope.showSearchClear = true;
      }
      if (value.length > 2 && value.charAt(0) !== '#') {
        $rootScope.$broadcast('searchString', value);
        //$rootScope.searchString = value;
        $rootScope.sideVisible = true;
      }
      if (value.length === 0) {
        resetSearch();
      }
    };

    $scope.searchTagFilter = function(tag) {
      return tag.charAt(0) === '#' ? tag : false;
    };

    $scope.tagSelected = function (tag) {
      // Remove first #
      tag = tag.substring(1);
      $rootScope.sideVisible = tag;
      $rootScope.$broadcast('tagFilter', tag);
    };

    $scope.searchClear = function () {
      $scope.showSearchClear = false;
      var searchInput = $element.find('.search-input');
      searchInput.val('');
      resetSearch();
      //$rootScope.sideVisible = false;
    };

  });
