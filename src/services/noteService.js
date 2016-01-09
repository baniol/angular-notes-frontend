'use strict';

angular.module('NgNotes')

  .factory('Notes', function ($rootScope, $http, $log, apiUrl, $q) {

    var notesCollection;

    var notes = {

      pullNotes: function () {
        return $http.get(apiUrl + '/api/notes')
          .then(function (data) {
            notesCollection = data.data;
          }, function (error) {
            $log.error(error);
          });
      },

      getNotes: function () {
        return notesCollection;
      },

      pushNote: function (note) {
        notesCollection.push(note);
        // Broadcast the change to enable other components to react
        $rootScope.$broadcast('pushNote', note);
      },

      save: function (note) {
        return $http.post(apiUrl + '/api/notes', note);
      },

      findById: function (id) {
        var out;
        angular.forEach(notesCollection, function (el) {
          if (el._id === id) {
            out = el;
          }
        });
        return out;
      },

      update: function (id, note) {
        return $http.put(apiUrl + '/api/notes/' + id, note);
      },

      delete: function (id) {
        return $http.delete(apiUrl + '/api/notes/' + id);
      },

      setOrder: function (notes) {
        return $http.post(apiUrl + '/api/order/', notes);
      }

    };

    return notes;

  });
