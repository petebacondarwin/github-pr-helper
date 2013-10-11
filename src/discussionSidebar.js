angular.module('discussionSidebar', ['labels', 'githubAPI'])

  // This directive adds a list of the current PR's labels when in detail view
  .directive('discussionSidebar', ['githubAPI', '$compile', function(githubAPI, $compile) {
    return {
      restrict: 'C',
      scope: {},
      compile: function(element, attrs) {

        // Add a label list to the end of the sidebar
        element.append('<div class="discussion-labels">' +
          '  <label-manager labels="labels" ></label-manager>' +
          '  <label-list labels="labels"></label-list>' +
          '</div>');

        return function(scope, element, attrs) {
          // Add the labels data to the scope
          githubAPI.getCheckedLabels().then(function(labels) {
            scope.labels = labels;
          });
        };
      }
    };
  }]);