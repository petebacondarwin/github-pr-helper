(function() {

angular.module('githubHacks', ['flashMessages', 'credentialsForm'])

// The pullsList and viewPullRequest directives, simply hook into the HTML that is provided by
// GitHub and inject a flash-messages element
.directive('pullsList', addFlashMessageDirective)
.directive('viewPullRequest', addFlashMessageDirective)
.directive('pullsList', addCredentialsDirective)
.directive('viewPullRequest', addCredentialsDirective)


// We don't want code blocks that appear inside gitHub description and comment field to be compiled
// so we terminates compilation at the point where these fields appear
.directive('discussionTimeline', terminateCompilationDirective)
.directive('diffView', terminateCompilationDirective)
.directive('commit', terminateCompilationDirective)

  
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
});

function addFlashMessageDirective() {
  return {
    restrict: 'C',
    compile: function(element) {
      element.prepend(
        '<credentials-form></credentials-form>'
      );
    }
  };
}

function addCredentialsDirective() {
  return {
    restrict: 'C',
    compile: function(element) {
      element.prepend(
        '<credentials-form></credentials-form>'
      );
    }
  };
}

function terminateCompilationDirective() {
  return {
    restrict: 'C',
    terminal: true,
    link: function(scope, element) {
      element.addClass('ng-terminated');
    }
  };
}


})();