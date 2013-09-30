angular.module('prDetailView', ['labels'])

  // We don't want angularjs interpolation that appears inside comments to be compiled
  // so this directive basically terminates compilation at the point where discussions
  // are rendered
  // (Unfortunately, GitHub also sticks content into a <meta property="og:description"> tag,
  // which also needs to be terminated)
  .directive('discussionTimeline', function() {
    return {
      restrict: 'C',
      terminal: true,
      link: function(scope, element) {
        element.addClass('ng-terminated');
      }
    };
  })
  .directive('diffView', function() {
    return {
      restrict: 'C',
      terminal: true,
      link: function(scope, element) {
        element.addClass('ng-terminated');
      }
    };
  })
  .directive('commit', function() {
    return {
      restrict: 'C',
      terminal: true,
      link: function(scope, element) {
        element.addClass('ng-terminated');
      }
    };
  })

  

  // We have to do this work at the head element, since we can't stop the compiler from
  // interpolating the current element's attributes, even if the element cotains a directive
  // set to terminal!
  .directive('head', function() {
    return {
      restrict: 'E',
      compile: function(element, attr) {
        var descriptionElement, descriptionContent, ogDescriptionElement, ogDescriptionContent;

        // Find the description and og:description meta tag and clear out their contents while we
        // compile the head element
        angular.forEach(element.children(), function(element) {

          // Wrap the element in jqLite to have access to `attr()`
          element = angular.element(element);

          if (element[0].nodeName === 'META' ) {
            if (element.attr('name') === 'description') {
              descriptionElement = element;
              descriptionContent = descriptionElement.attr('content');
              descriptionElement.attr('content', '');
            }

            if (element.attr('property') === 'og:description') {
              ogDescriptionElement = element;
              ogDescriptionContent = ogDescriptionElement.attr('content');
              ogDescriptionElement.attr('content', '');
            }
          }

        });

        return function postLink(scope, element, attr) {
          // Add the contents back into the descriptin and og:description meta tags
          if ( descriptionElement ) {
            descriptionElement.attr('content', descriptionContent);
          }
          if ( ogDescriptionElement ) {
            ogDescriptionElement.attr('content', ogDescriptionContent);
          }
        };
      }
    };
  })

  // This directive adds a list of the current PR's labels when in detail view
  .directive('discussionSidebar', ['getCheckedLabelsFor', '$location', '$compile', function(getCheckedLabelsFor, $location, $compile) {
    return {
      restrict: 'C',
      scope: true,
      link: function(scope, element, attrs) {

        // Extract the PR number from the URL
        var prNumber = $location.absUrl().split('/').pop();

        getCheckedLabelsFor(prNumber).then(function(labels) {
          scope.labels = labels;
        });

        // Add a label list to the end of the sidebar
        element.append($compile(
          '<div class="discussion-labels">' +
          '  <label-manager></label-manager>' +
          '  <ul class="color-label-list filter-list small">' +
          '    <li ng-repeat="label in labels">' +
          '      <gh-label ng-if="label.checked" class="filter-item color-label"></gh-label>' +
          '    </li>' + 
          '  </ul>' +
          '</div>')(scope));
      }
    };
  }])

  .directive('labelManager', ['updateLabel', function(updateLabel) {
    return {
      restrict: 'E',
      replace: true,
      link: function(scope) {
        scope.updateFilteredLabels = function() {
          console.log(scope.labels);
          scope.filteredLabels = scope.labels;
          scope.labelsLoading = false;
        };
        scope.filteredLabels = [];
        scope.labelsLoading = true;
        scope.$watch('labels', scope.updateFilteredLabels);
        scope.toggleLabel = function(label) {
          label.checked = !label.checked;
          updateLabel(label);
        };
      },
      template:
'<div class="label-manager">' +
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
  '</div>' +
'</div>'
    };
  }]);