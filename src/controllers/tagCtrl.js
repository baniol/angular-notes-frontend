'use strict';

angular.module('NgNotes')

  .controller('TagCtrl', function ($rootScope, $scope, Tags) {

    /**
     * Loading all tags owned by the user to the scope
     */
     $scope.userTags = Tags.getTags();

    /**
     * Triggered in tagService on updating tag cloud
     */
     $scope.$on('pushTag', function (event, tag) {
        $scope.userTags.push(tag);
     });

     //$scope.$on('openTagCloud', function () {
        //var modalInstance = $modal.open({
          //templateUrl: 'views/tag-cloud.html',
          //controller: 'TagCtrl'
        //});
     //});

    /**
     * Filter note list by the clicked tag.
     */
    $scope.filterByTag = function (name) {
      if ($scope.queryTag === name) {
        $scope.queryTag = null;
      }
      else {
        $scope.queryTag = name;
      }
      $rootScope.sideVisible = $scope.queryTag;
      $rootScope.$broadcast('tagFilter', $scope.queryTag);
    };

  });
