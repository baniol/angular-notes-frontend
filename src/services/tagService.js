'use strict';

angular.module('NgNotes')

  .factory('Tags', function ($rootScope, $http, $log, apiUrl) {

    var tagsCollection;

    var tags = {

      pullTags: function () {
        return $http.get(apiUrl + '/api/tags')
          .then(function (data) {
            console.log(data);
            tagsCollection = data.data;
          }, function (error) {
            $log.error(error);
          });
      },

      getTags: function () {
        return tagsCollection;
      },

      /**
       * Updates tag DOM list with a new (unique) tag.
       * @param {Collection} tags note's tags
       */
      updateTagCloud: function (tags) {
        // Push only unique (not yet existing) tags
        var tagNames = _.pluck(tagsCollection, 'text');
        angular.forEach(tags, function (el) {
          if (_.indexOf(tagNames, el.text) === -1) {
            // Push the new tag to the serivce's collection
            tagsCollection.push(el);
            // Push the new tag to DOM tag cloud
            $rootScope.$broadcast('pushTag', el);
          }
        });
      },

      getTagQuery: function (query) {
         return $http.get(apiUrl + '/api/tags?query=' + query);
      },

      editTag: function (tag) {
        return $http.put(apiUrl + '/api/tags/' + tag.id, tag);
      },

      removeTag: function (id) {
        return $http.delete(apiUrl + '/api/tags/' + id);
      }

    };

    return tags;

  });
