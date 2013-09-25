(function() {

angular.module('listGroupItems', ['labels'])


  // Each item sits inside a list-group-item div.  This directive creates a new scope
  // for this item and attaches an object to the scope to share data among the directives
  // for this item
  .directive('listGroupItem', [function() {
    return {
      restrict: 'C',
      scope: true,
      controller: function($scope) { 
        $scope.listGroupItem = {};
      }
    };
  }])


  // At the moment the best place to get the PR number is by scraping it from an element
  // with list-group-item-number class.
  .directive('listGroupItemNumber', ['getLabels', function(getLabels) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs, listGroupItem) {
        console.log(element.text());
        scope.listGroupItem.number = element.text().substr(1);
        getLabels(scope.listGroupItem.number).then(function(labels) {
          scope.listGroupItem.labels = labels;
        });
      }
    };
  }])


  // The labels will go inside an element with the list-group-item-name class
  .directive('listGroupItemName', ['$compile', function($compile) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        element.append($compile('<gh-inline-labels class="labels"></gh-inline-labels>')(scope));
      }
    };
  }])


  .directive('ghInlineLabels', [function(){
    return {
      restrict: 'E',
      replace: true,
      // Simply repeat over the labels that have been downloaded creating a label span,
      // which will be picked up by and filled by the label directive
      template: 
        '<span>' +
        '  <gh-label ng-repeat="label in listGroupItem.labels" class="label"></gh-label>' +
        '</span>'
    };
  }]);

})();