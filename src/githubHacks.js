(function() {


function directiveFactory(directiveDefinition) {
  return function() {
    return directiveDefinition;
  };
}

// This directive injects the flashMessages directive into the DOM
var addFlashMessageDirective = {
  restrict: 'C',
  compile: function(element) {
    element.prepend(
      '<div class="flash-messages"></div>'
    );
  }
};

// This directive injects the credentialsForm directive into the DOM
var addCredentialsDirective = {
  restrict: 'C',
  compile: function(element) {
    element.prepend(
      '<credentials-form></credentials-form>'
    );
  }
};

// This directive terminates compilation at the given point in the DOM
// This is useful when text in the DOM might contain what appears to be interpolation
// or directives as part of its content.
var terminateCompilationDirective = {
  restrict: 'C',
  terminal: true,
  link: function(scope, element) {
    element.addClass('ng-terminated');
  }
};

angular.module('githubHacks', ['flashMessages', 'credentialsForm'])

// The pullsList and viewPullRequest directives, simply hook into the HTML that is provided by
// GitHub and inject a flash-messages element
.directive('pullsList', directiveFactory(addFlashMessageDirective))
.directive('viewPullRequest', directiveFactory(addFlashMessageDirective))
.directive('pullsList', directiveFactory(addCredentialsDirective))
.directive('viewPullRequest', directiveFactory(addCredentialsDirective))


// We don't want code blocks that appear inside gitHub description and comment field to be compiled
// so we terminates compilation at the point where these fields appear
.directive('discussionTimeline', directiveFactory(terminateCompilationDirective))
.directive('diffView', directiveFactory(terminateCompilationDirective))
.directive('commit', directiveFactory(terminateCompilationDirective))
.directive('title', directiveFactory(
  angular.extend({}, terminateCompilationDirective, { restrict: 'E'})))
.directive('listGroupItemName', directiveFactory(terminateCompilationDirective))
.directive('listGroupItemSummary', directiveFactory(terminateCompilationDirective))

  
// GitHub also puts code block containing fields into some <meta> tags, which also needs to be terminated
// We have to do this work at the <head> tag, rather than the <meta> tag, since we can't stop the
// angular compiler from interpolating the current element's attributes, even if the element contains
// a directive set to terminal!
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
        // Add the contents back into the description and og:description meta tags
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

// Similar to the meta tags above,  GitHub also puts code blocks into the `data-filter`attribute of
// list-group-items. So we need to remove this before angular.js tries to compile them;
.directive('listGroup', function() {
  return {
    restrict: 'C',
    priority: 1000,
    compile: function(element, attr) {
      var listGroupItems = [];
      angular.forEach(element.children(), function(element) {
        // Wrap the element in jqLite to have access to `attr()` and `hasClass()`
        element = angular.element(element);
        if ( element.hasClass('list-group-item')) {
          listGroupItems.push({ element: element, dataFilterText: element.attr('data-filter')});
          element.attr('data-filter', '');
        }
      });

      return function postLink(scope, element, attr) {
        angular.forEach(listGroupItems, function(item) {
          item.element.attr('data-filter', item.dataFilterText);
        });
      };
    }
  };
});

})();