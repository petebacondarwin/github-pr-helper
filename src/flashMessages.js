angular.module('flashMessages', [])
  

// The messages to display.  Just push to the array an object of the form:
// { text: 'Message text to display', type='warn|error|...'}
.value('flashMessages', [])


// The directive that displays the flash messages.  The GitHub CSS provides the formatting
// If the user clicks on the div.close element then it will remove itself from the array
.directive('flashMessages', ['flashMessages', function(flashMessages) {
  return {
    restrict: 'C',
    scope: {},
    link: function(scope) {
      scope.flashMessages = flashMessages;
    },
    template: 
      '<div ng-repeat="msg in flashMessages" class="flash flash-{{msg.type}}">' +
        '<div class="close octicon octicon-x" ng-click="flashMessages.splice(flashMessages.indexOf(msg),1)"></div>' +
        '{{msg.text}}' +
      '</div>'
  };
}]);