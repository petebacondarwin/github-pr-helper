angular.module('labels', [])


.factory('getLabels', ['$http',function($http) {
  return function(prNumber) {
    return $http.get('https://api.github.com/repos/angular/angular.js/issues/' + prNumber + '/labels')
      .then(function(response) { return response.data; });
  };
}])


.factory('brightness', [function() {
  return function brightness(color) {
    var red = parseInt(color.substr(0,2), 16);
    var green = parseInt(color.substr(2,2), 16);
    var blue = parseInt(color.substr(4,2), 16);
    return ((red*299) + (green*587) + (blue*114)) / 1000;
  };
}])


.directive('ghLabel', ['brightness', function(brightness) {
  return {
    restrict: 'E',
    replace: true,
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