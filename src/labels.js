angular.module('labels', ['CSRF'])

// At the moment this service only works once per application
// TODO: get watching the location working
.factory('gitHubUrl', ['$location', function($location) {
  var gitHubUrlRegex = /^https?:\/\/github.com\/([^\/]+)\/([^\/]+)\/pull(?:s|\/(\d+))/;
  var parts = gitHubUrlRegex.exec($location.absUrl());
  var gitHubUrl = {
    owner: parts[1],
    repos: parts[2],
    prNumber: parts[3]
  };
  gitHubUrl.getAPIUrl = function() {
    return 'https://api.github.com/repos/'+ gitHubUrl.owner +'/' + gitHubUrl.repos;
  };
  return gitHubUrl;
}])


.value('githubAuth', {
  client_id: localStorage.getItem('github.client_id'),
  client_secret: localStorage.getItem('github.client_secret')
})

// Get a list of labels for a given pull request
.factory('getLabelsFor', ['$http', 'gitHubUrl', 'githubAuth', function($http, gitHubUrl, githubAuth) {
  return function getLabelsFor(prNumber) {
    prNumber = prNumber || gitHubUrl.prNumber;
    return $http.get(gitHubUrl.getAPIUrl() + '/issues/' + prNumber + '/labels', { params: githubAuth})
      .then(function(response) { return response.data; });
  };
}])


.factory('getAllLabels', ['$http', 'gitHubUrl', 'githubAuth', function($http, gitHubUrl, githubAuth) {
  return function getAllLabels() {
    return $http.get(gitHubUrl.getAPIUrl() + '/labels', { params: githubAuth})
      .then(function(response) { return response.data; });
  };
}])


.factory('getCheckedLabelsFor', ['getAllLabels', 'getLabelsFor', '$q', function(getAllLabels, getLabelsFor, $q) {
  return function getAllLabelsCheckedFor(prNumber) {
    return $q.all([getAllLabels(), getLabelsFor(prNumber)]).then(function(results) {
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
  };
}])


.factory('updateLabel', ['$http', 'gitHubUrl', 'githubAuth', function($http, gitHubUrl, githubAuth) {
  return function(label) {
    return $http({
      method: label.checked ? 'PUT' : 'DELETE',
      headers: {
        'Accept': '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      url: 'https://github.com/'+ gitHubUrl.owner +'/' + gitHubUrl.repos + '/issues/labels/modify_assignment',
      data: "issues%5B%5D="+gitHubUrl.prNumber+"&labels%5B%5D="+label.name,
      params: githubAuth
    });
  };
}])


// Get the brightness of a colour (say for a background) so we can work out what colour to make
// the text in the foreground.
.factory('brightness', [function() {
  return function brightness(color) {
    var red = parseInt(color.substr(0,2), 16);
    var green = parseInt(color.substr(2,2), 16);
    var blue = parseInt(color.substr(4,2), 16);
    return ((red*299) + (green*587) + (blue*114)) / 1000;
  };
}])

// An element that displays a coloured label
.directive('ghLabel', ['brightness', function(brightness) {
  return {
    restrict: 'E',
    replace: true,
    scope: { label: '=' },
    template: '<span title="{{label.name}}">{{label.name}}</span>',
    link: function(scope, element, attrs) {
      // Set the colour of the label
      element.css('background-color', '#' + scope.label.color);

      // Calculate whether the label should have black or white text
      var light = brightness(scope.label.color) > 255/2;
      element.css('color', light ? 'black' : 'white');
      element.addClass(light ? 'darker' : 'lighter');
    }
  };
}]);