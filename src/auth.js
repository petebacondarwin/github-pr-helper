angular.module('auth', [])

.factory('authInfo', function() {
  return {};
})

.directive('assignee', ['authInfo', function(authInfo){
  return {
    restrict: 'C',
    link: function(scope, element, attr) {
      var inputs = element.find('input');
      angular.forEach(inputs, function(input) {
        var name = input.getAttribute('name');
        if ( name === 'authenticity_token') {
          authInfo[name] = input.getAttribute('value');
        }
      });
      console.log(authInfo);
    }
  };
}]);