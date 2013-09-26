angular.module('discussionSidebar', ['labels'])

  // This directive adds a list of the current PR's labels when in detail view
  .directive('discussionSidebar', ['getLabels', '$location', '$compile', function(getLabels, $location, $compile) {
    return {
      restrict: 'C',
      scope: true,
      link: function(scope, element, attrs) {

        // Extract the PR number from the URL
        var prNumber = $location.absUrl().split('/').pop();

        getLabels(prNumber).then(function(labels) {
          scope.labels = labels;
        });

        // Add a label list to the end of the sidebar
        element.append($compile(
          '<div class="discussion-labels">' +
          '  <ul class="color-label-list filter-list small">' +
          '    <li ng-repeat="label in labels">' +
          '      <gh-label class="filter-item color-label"></gh-label>' +
          '    </li>' + 
          '  </ul>' +
          '</div>')(scope));
      }
    };
  }]);