(function() {

angular.module('listGroupItems', ['labels', 'githubAPI'])


  // Each item sits inside a list-group-item div.  This directive creates a new scope
  // for this item and attaches an object to the scope to share data among the directives
  // for this item
  .directive('listGroupItem', [function() {
    return {
      restrict: 'C',
      scope: {},
      controller: function($scope) { 
        //TODO: destroy the scope when this element is removed by GitHub
      }
    };
  }])


  // At the moment the best place to get the PR number is by scraping it from an element
  // with list-group-item-number class.
  .directive('listGroupItemNumber', ['githubAPI', function(githubAPI) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var number = element.text().substr(1);
        githubAPI.getIssue(number).then(function(issue) {
          scope.issue = issue;
        });
      }
    };
  }])


  // The labels will go inside an element with the list-group-item-name class
  .directive('listGroupItemName', ['$compile', function($compile) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        element.append($compile(
        '<span class="labels">' +
        '  <gh-label ng-repeat="label in issue.labels" class="label" label="label"></gh-label>' +
        '</span>'
        )(scope));
      }
    };
  }])





})();