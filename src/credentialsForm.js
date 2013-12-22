angular.module('credentialsForm', ['githubAPI'])

.directive('credentialsForm', ['githubAuth', function(githubAuth) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    link: function(scope, element, attrs) {
      scope.isHidden = function() {
        return githubAuth.credentialsFormHidden();
      };
      scope.hideForm = function() {
        githubAuth.hideCredentialsForm();
      };
      scope.storeCredentials = function() {
        githubAuth.storeCredentials(scope.accessToken);
      };
    },
    template:
'<div class="flash flash-warn" ng-hide="isHidden()">' +
  '<div class="close octicon octicon-x" ng-click="hideForm()"></div>' +
  'You have not entered your GitHub Personal Access Token to be stored in localStorage.<br/>' +
    '<em>You can generate these credentials here: ' +
    '<a target="_blank" href="https://github.com/settings/tokens/new">Create a new Personal Access Token</a>' +
  '</em><br/>' +
    '<strong>Be aware that this will permanently store your access token in the browser\'s local storage. ' +
    'Do not do this if you are on an unsecure shared computer.</strong>' +
  '<dl class="form">' +
    '<dt><label>Access Token</label></dt><dd><input ng-model="accessToken" size="80"></dd>' +
  '</dl>' +
  '<dl class="form">' +
    '<p><button class="button primary" ng-click="storeCredentials()">Save Access Token</button></p>' +
  '</dl>' +
'</div>'
  };
}]);