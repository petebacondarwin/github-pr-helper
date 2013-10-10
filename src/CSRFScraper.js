angular.module('CSRFScraper', [])

// This directive strips the CSRF token from the `<meta>` tag in the HTML `<head>`
// and adds it as a default header to all $http PUT and DELETE requests
.directive('meta', ['$http', '$log', function($http, $log) {
  var headers = $http.defaults.headers;
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      var header;
      if ( attr.name == 'csrf-token' ) {
        header = { 'X-CSRF-Token': attr.content };
        headers.put = angular.extend(headers.put, header);
        headers.post = angular.extend(headers.post, header);
        headers.delete = angular.extend(headers.put, header);
      }
    }
  };
}]);