// The labels module is the main service for interacting with the GitHub API
// we declare a dependency on the CSRF because we want its directive to scrape the CSRF token
// from the meta tags
angular.module('githubAPI', ['CSRFScraper', 'flashMessages'])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(function(githubAuth, $q) {
    return {
      // Automatically reject $http calls if we have reached the limit
      'request': function(config) {
        if (githubAuth.rateLimitReached) {
          return $q.reject('rate limit reached');
        }
        var accessToken = githubAuth.getCredentials();
        if ( accessToken ) {
          config.headers.Authorization = 'Basic ' + btoa(accessToken);
        }
        return $q.when(config);
      },
      // Track whether we have hit the rate limit
      'responseError': function(rejection) {
        if (rejection.status === 403 && !(githubAuth.getCredentials())) {
          githubAuth.rateLimitReached = true;
        }
        throw $q.reject();
      }
    };
  });
}])

// At the moment this service only works once per application
// TODO: get watching the location working
.factory('githubUrl', function($location) {
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
})


// This service value gets client credentials for github from the localstorage
// it is needed to prevent the API request limiting from blocking requests
.factory('githubAuth', function($rootScope, flashMessages) {
  
  var githubAuth = {
    rateLimitReached: false,
    requestLimitMessage: {
      text: 'You have reached the api request limit. Please add GitHub client credentials to localStorage',
      type: 'warn'
    },

    credentialsFormHidden: function() {
      return sessionStorage.getItem('github.hideCredentialsForm') || githubAuth.getCredentials();
    },
    hideCredentialsForm: function() {
      sessionStorage.setItem('github.hideCredentialsForm', true);
    },
    showCredentialsForm: function() {
      sessionStorage.removeItem('github.hideCredentialsForm');
    },
    getCredentials: function() {
      return localStorage.getItem('github.access_token');
    },
    storeCredentials: function(accessToken) {
      localStorage.setItem('github.access_token', accessToken);
    }
  };

  $rootScope.$watch(
    function() { return githubAuth.rateLimitReached; },
    function(value) {
      if ( value ) {
        githubAuth.showCredentialsForm();
        flashMessages.push(githubAuth.requestLimitMessage);
      } else {
        flashMessages.splice(flashMessages.indexOf(githubAuth.requestLimitMessage), 1);
      }
  });

  return githubAuth;
})


// Get a list of labels for a given pull request
.factory('githubAPI', function($http, githubUrl, githubAuth, $q) {
  var githubAPI = {
    getIssue: function(prNumber) {
      prNumber = prNumber || githubUrl.prNumber;
      return $http.get(githubUrl.getAPIUrl() + '/issues/' + prNumber)
        .then(function(response) { return response.data; });
    },
    getAllLabels: function() {
      return $http.get(githubUrl.getAPIUrl() + '/labels')
        .then(function(response) { return response.data; });
    },
  // Get a list of all the labels in the repository with the `checked` property set to true for each
  // label that is applied to the specified PR/issue
    getCheckedLabels: function() {
      return $q.all([githubAPI.getAllLabels(), githubAPI.getIssue(githubUrl.prNumber)]).then(function(results) {
        var allLabels = results[0];
        var prLabels = results[1].labels;
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
    // This method will update the labels for the current issue
    // NOTE: It uses an undocumented request that is not on api.github.com
    updateLabel: function(label) {
      return $http({
        method: label.checked ? 'PUT' : 'DELETE',
        headers: {
          'Accept': '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        url: 'https://github.com/'+ githubUrl.owner +'/' + githubUrl.repos + '/issues/labels/modify_assignment',
        data: "issues%5B%5D="+githubUrl.prNumber+"&labels%5B%5D="+label.name,
      });
    }
  };
  return githubAPI;
});
