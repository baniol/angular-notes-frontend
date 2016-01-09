'use strict';

angular.module('NgNotes')

  .controller('ManageTagsCtrl', function ($rootScope, $scope, $message, Tags) {

    var tags = Tags.getTags();
    $scope.tags = tags;

    $scope.editTag = function (tag) {
      // @TODO sanitize user's input !
      Tags.editTag({name: tag.text, id: tag._id})
        .success(function () {
          $message('Tag updated');
        })
        .error(function () {
          $message('This tag name already exists!');
        });
    };

    $scope.removeTag = function (tag) {
      if (confirm('Are you sure?')) {
        Tags.removeTag(tag._id)
          .success(function () {
            $scope.tags.splice($scope.tags.indexOf(tag), 1);
            $message('Tag removed');
          });
      }
    };

  });
