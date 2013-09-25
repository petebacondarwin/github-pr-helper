(function() {

  function brightness(color) {
    var red = parseInt(color.substr(0,2), 16);
    var green = parseInt(color.substr(2,2), 16);
    var blue = parseInt(color.substr(4,2), 16);
    return ((red*299) + (green*587) + (blue*114)) / 1000;
  }

  angular.module('extension', [])

    .directive('listGroupItem', [function() {
      return {
        restrict: 'C',
        scope: true,
        controller: function($scope) { 
          $scope.listGroupItem = {};
        }
      };
    }])

    .directive('listGroupItemNumber', ['$http', '$location', function($http, $location) {
      return {
        restrict: 'C',
        link: function(scope, element, attrs, listGroupItem) {
          console.log(element.text());
          scope.listGroupItem.number = element.text().substr(1);
          $http.get('https://api.github.com/repos/angular/angular.js/issues/' +
                      scope.listGroupItem.number + '/labels')
            .then(function(response) {
              scope.listGroupItem.labels = response.data;
              console.log('Loaded item: ', scope.listGroupItem);
            });
        }
      };
    }])

    .directive('listGroupItemName', ['$compile', function($compile) {
      return {
        restrict: 'C',
        link: function(scope, element, attrs) {
          element.append($compile('<span class="labels"></span>')(scope));
        }
      };
    }])

    .directive('labels', [function(){
      return {
        restrict: 'C',
        template: '<span ng-repeat="label in listGroupItem.labels" class="label"></span>'
      };
    }])

    .directive('label', [function(){
      return {
        restrict: 'C',
        link: function(scope, element, attr) {
          element.text(scope.label.name);
          element.css('background-color', '#' + scope.label.color);
          var light = brightness(scope.label.color) > 255/2;
          element.css('color', light ? 'black' : 'white');
          element.addClass(light ? 'darker' : 'lighter');
        }
      };
    }]);



  // Bootstrap the application
  var pullList = angular.element(document.getElementsByClassName('list-group'));
  console.log(pullList);
  angular.bootstrap(pullList, ['extension']);

})();