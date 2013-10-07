angular.module('prDetailView', ['labels', 'githubAPI'])

  // This directive adds a list of the current PR's labels when in detail view
  .directive('discussionSidebar', ['githubAPI', '$compile', function(githubAPI, $compile) {
    return {
      restrict: 'C',
      scope: true,
      link: function(scope, element, attrs) {

        githubAPI.getCheckedLabels().then(function(labels) {
          scope.labels = labels;
        });

        // Add a label list to the end of the sidebar
        element.append($compile(
          '<div class="discussion-labels">' +
          '  <div class="label-manager"></div>' +
          '  <ul class="color-label-list filter-list small">' +
          '    <li ng-repeat="label in labels">' +
          '      <gh-label label="label" ng-if="label.checked" class="filter-item color-label"></gh-label>' +
          '    </li>' + 
          '  </ul>' +
          '</div>')(scope));
      }
    };
  }])

  .directive('labelManager', ['githubAPI', 'orderByFilter', function(githubAPI, orderByFilter) {
    return {
      restrict: 'C',
      link: function(scope) {
        scope.updateFilteredLabels = function() {
          scope.filteredLabels = orderByFilter(scope.labels, 'name');
          scope.labelsLoading = false;
        };
        scope.filteredLabels = [];
        scope.labelsLoading = true;
        scope.$watch('labels', scope.updateFilteredLabels);
        scope.toggleLabel = function(label) {
          label.checked = !label.checked;
          githubAPI.updateLabel(label);
        };
      },
      template:
      '<strong>Labels</strong>' +
      '<div class="select-menu label-select-menu" ng-class="{active: showModal}">' +

        '<span class="minibutton icon-only select-menu-button" ng-click="showModal=!showModal">' +
          '<span class="octicon octicon-gear"></span>' +
        '</span>' +

        '<div class="select-menu-modal-holder">' +
          '<div class="select-menu-modal">' +

            '<div class="select-menu-header">' +
              '<span class="select-menu-title">Apply labels to this issue</span>' +
              '<span class="octicon octicon-remove-close" ng-click="showModal=false"></span>' +
            '</div> <!-- /.select-menu-header -->' +

            '<div class="select-menu-error-shell">' +
              '<span class="select-menu-error">Whoops, there was an error</span>' +
            '</div>' +

            '<div class="select-menu-filters">' +
              '<div class="select-menu-text-filter">' +
                '<input type="text" ng-model="labelFilterField" placeholder="Filter labels" autocomplete="off">' +
              '</div>' +
            '</div> <!-- /.select-menu-filters -->' +

            '<div class="select-menu-list">' +
              '<div class="select-menu-item" ng-repeat="label in filteredLabels" ng-class="{selected : label.checked}" ng-click="toggleLabel(label)">' +
                '<span class="select-menu-item-icon octicon octicon-check" ></span>' +
                '<div class="select-menu-item-text">' +
                  '<div class="color-label-wrapper">' +
                    '<div class="color-label" >' +
                      '<span class="color" ng-style="{\'background-color\': \'#\'+label.color}">&nbsp;</span>' +
                      '<span class="name">{{label.name}}</span>' +
                      '<span class="octicon octicon-remove-close"></span>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div class="select-menu-no-results" ng-style="{display: filteredLabels.length == 0 && \'block\'}">Nothing to show</div>' +
            '<div class="select-menu-loading-overlay" ng-style="{display: labelsLoading && \'block\'}">Loading…</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    };
  }]);