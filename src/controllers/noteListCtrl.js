'use strict';

angular.module('NgNotes')

  .controller('NoteListCtrl', function($rootScope, $scope, Notes, $state, $stateParams, orderByFilter) {

    //$scope.searchString = null;
    //$scope.searchString = $rootScope.searchString;

   /**
    * Get notes collection from Notes service
    * and populate the $scope.notes collection
    */
    var notes = Notes.getNotes();
    $scope.notes = orderByFilter(notes, ['order']);
    $scope.currentId = $rootScope.$stateParams.id;

    /**
     * Show tag list if there's no picked id
     */
    if (!$scope.currentId) {
      $rootScope.sideVisible = true;
    }

    /**
     * Watch for new elements in the notes collection
     */
    $scope.$on('pushNote', function (event, data) {
      $scope.notes.push(data);
      $scope.select(data);
    });

    /**
     * Filter note list by selected tag from tag cloud
     */
    $scope.$on('tagFilter', function (event, data) {
      $scope.queryTag = data;
    });

    $scope.$on('searchString', function (event, string) {
      $scope.searchString = string;
    });

    /**
     * React on list item select (click)
     */
    $scope.select = function (note) {
      $rootScope.searchString = $scope.searchString;
      $state.go('notes.details', {id: note._id});
      $scope.currentId = note._id;
    };

    /**
     * Remove a note from the list.
     */
    $scope.delete = function (note, event) {
      event.stopPropagation();
      if (confirm('Are you sure?')) {
        if ($scope.currentId === note._id) {
          $rootScope.$broadcast('clearNoteForm');
        }
        // @TODO error handling
        Notes.delete(note._id).success(function () {
          $scope.notes.splice($scope.notes.indexOf(note), 1);
        });
      }
    };

    // Options for jquery ui sortable list
    $scope.sortableOptions = {
      stop: function() {
        var order = $scope.notes.map(function(i){
          return {id: i._id, order: i.order};
        });
        Notes.setOrder(order);
      }
    };

    // Watch notes collection for order changes
    $scope.$watchCollection('notes', function () {
      for (var index in $scope.notes) {
        $scope.notes[index].order = index;
      }
    });

  });
