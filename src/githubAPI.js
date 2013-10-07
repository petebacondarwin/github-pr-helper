// The labels module is the main service for interacting with the GitHub API
// we declare a dependency on the CSRF because we want its directive to scrape the CSRF token
// from the meta tags
angular.module('githubAPI', ['CSRF'])

// At the moment this service only works once per application
// TODO: get watching the location working
.factory('githubUrl', ['$location', function($location) {
  var githubUrlRegex = /^https?:\/\/github.com\/([^\/]+)\/([^\/]+)\/pull(?:s|\/(\d+))/;
  var parts = githubUrlRegex.exec($location.absUrl());
  var githubUrl = {};

  if (parts) {
    githubUrl = {
      owner: parts[1],
      repos: parts[2],
      prNumber: parts[3]
    };
  }
  githubUrl.getAPIUrl = function() {
    return 'https://api.github.com/repos/'+ githubUrl.owner +'/' + githubUrl.repos;
  };
  return githubUrl;
}])


// This service value gets client credentials for github from the localstorage
// it is needed to prevent the API request limiting from blocking requests
.value('githubAuth', {
  client_id: localStorage.getItem('github.client_id'),
  client_secret: localStorage.getItem('github.client_secret')
})

// Get a list of labels for a given pull request
.factory('githubAPI', ['$http', 'githubUrl', 'githubAuth', '$q', function($http, githubUrl, githubAuth, $q) {
  var githubAPI = {
    getLabelsFor: function(prNumber) {
      prNumber = prNumber || githubUrl.prNumber;
      return $http.get(githubUrl.getAPIUrl() + '/issues/' + prNumber + '/labels', { params: githubAuth})
        .then(function(response) { return response.data; });
    },
    getAllLabels: function() {
      return $http.get(githubUrl.getAPIUrl() + '/labels', { params: githubAuth})
        .then(function(response) { return response.data; });
    },
  // Get a list of all the labels in the repository with the `checked` property set to true for each
  // label that is applied to the specified PR/issue
    getCheckedLabels: function() {
      return $q.all([githubAPI.getAllLabels(), githubAPI.getLabelsFor(githubUrl.prNumber)]).then(function(results) {
        var allLabels = results[0];
        var prLabels = results[1];
        var checkLabel = function (url) {
          for (var i = allLabels.length - 1; i >= 0; i--) {
            if ( allLabels[i].url == url ) {
              allLabels[i].checked = true;
              break;
            }
          }
        };
        angular.forEach(prLabels, function(label) {
          checkLabel(label.url);
        });

        return allLabels;
      });
    },
    updateLabel: function(label) {
      return $http({
        method: label.checked ? 'PUT' : 'DELETE',
        headers: {
          'Accept': '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        url: 'https://github.com/'+ githubUrl.owner +'/' + githubUrl.repos + '/issues/labels/modify_assignment',
        data: "issues%5B%5D="+githubUrl.prNumber+"&labels%5B%5D="+label.name,
        params: githubAuth
      });
    }
  };
  return githubAPI;
}]);
