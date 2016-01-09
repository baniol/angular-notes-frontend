'use strict';

angular.module('NgNotes')

  .controller('NoteDetailsCtrl', function ($rootScope, $scope, $message, Notes, Tags, $sce, $state, $stateParams) {

    $scope.currentNote = Notes.findById($stateParams.id);

    //$scope.searchString = $rootScope.searchString;

    //if ($scope.currentNote) {
      ////$scope.contentHtml = $sce.trustAsHtml($scope.currentNote.html);
      //$scope.contentHtml = $scope.currentNote.html;
    //}

    /**
     * Reset inputs for note adding.
     * @private
     */
    function resetForm () {
      $scope.currentNote = {};
    }

    /**
     * Click on new note button in the top bar
     */
    $scope.$on('newNote', function () {
      $scope.editMode = true;
      $scope.newNoteFlag = true;
      resetForm();
    });

    $scope.$on('searchString', function (event, string) {
      $scope.searchString = string;
    });

    $scope.highlight = function () {
      var node;
      var next;
      if (!$scope.searchString) {
        return $sce.trustAsHtml($scope.currentNote.html);
      }
      else {
        var html = $scope.currentNote.html;
        var body = document.createElement('body');
        // Turn the HTML string into a DOM tree
        body.innerHTML = html;

        // Walk the dom looking for the given text in text nodes
        walk(body);
        node = body.firstChild;
        var htmlString = '';
        while (node) {
          next = node.nextSibling;
          if (node.outerHTML) {
            htmlString += node.outerHTML;
          }
          node = next;
        }
        return $sce.trustAsHtml(htmlString);
      }

      function walk(node) {
        var child, next;
        switch (node.nodeType) {
          case 1:  // Element
          case 9:  // Document
          case 11: // Document fragment
            child = node.firstChild;
            while (child) {
              next = child.nextSibling;
              walk(child);
              child = next;
            }
            break;
          case 3: // Text node
            handleText(node);
            break;
        }
      }

      function handleText(node) {
        var regex = new RegExp($scope.searchString, 'g');
        var cls = 'highlighted';
        var value, df, m, l, start = 0, highlightSpan;
        if ((node.nodeType === 3) && (value = node.data.trim())) {
          while (m = regex.exec(value)) {
            if (!df) {
              df = document.createDocumentFragment();
            }
            if (l = m.index - start) {
              df.appendChild(document.createTextNode(value.substr(start, l)));
            }
            highlightSpan = document.createElement('span');
            highlightSpan.className = cls;
            highlightSpan.appendChild(document.createTextNode(m[0]));
            df.appendChild(highlightSpan);
            start = m.index + m[0].length;
          }
          if (df) {
            if (l = value.length - start) {
              df.appendChild(document.createTextNode(value.substr(start, l)));
            }
            node.parentNode.replaceChild(df, node);
          }
        }
      }
    };

    /**
     * Saving or updating a note.
     */
    $scope.save = function (e) {
      e.preventDefault();
      var data = {
        title: $scope.currentNote.title,
        content: $scope.currentNote.content,
        tags: $scope.currentNote.tags
      };

      Tags.updateTagCloud($scope.currentNote.tags);

      // Saving new note
      if (!$scope.currentNote._id) {
        Notes.save(data).success(function (res) {
          Notes.pushNote(res);
          resetForm();
          $message('Note saved');
        });
        $scope.newNoteFlag = false;
      }
      // Updating notes
      else {
        Notes.update($scope.currentNote._id, data).success(function (res) {
          $scope.currentNote.title = data.title;
          $scope.currentNote.content = data.content;
          $scope.currentNote.html = res.html;
          $scope.contentHtml = $sce.trustAsHtml(res.html);
          $message('Note updated');
        });
      }
    };

    /**
     * Get tags for autocompletion 
     */
    $scope.loadTags = function(query) {
      return Tags.getTagQuery(query);
    };

    $scope.$on('clearNoteForm', function () {
      resetForm();
      $scope.currentNote = {};
      $scope.contentHtml = '';
    });


  });
