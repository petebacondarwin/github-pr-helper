angular.module('CSRF', [])

.directive('meta', ['$http', '$log', function($http, $log) {
  return {
    restrict: 'E',
    link: function postLink(scope, element, attr) {
      var header;
      if ( attr.name == 'csrf-token' ) {
        $log.debug('extracting csrf-token:', attr.content);
        header = { 'X-CSRF-Token': attr.content };
        $http.defaults.headers.put = angular.extend($http.defaults.headers.put, header);
        $http.defaults.headers.delete = angular.extend($http.defaults.headers.put, header);
      }
    }
  };
}]);