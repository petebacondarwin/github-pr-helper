angular.module('credentialsForm', [])

.directive('credentialsForm', ['githubAuth', function(githubAuth) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    link: function(scope, element, attrs) {
      scope.isVisible = function() {
        return githubAuth.credentialsFormVisible();
      };
      scope.hideForm = function() {
        githubAuth.hideCredentialsForm();
      }
      scope.storeCredentials = function() {
        githubAuth.storeCredentials(scope.client_id, scope.client_secret);
      };
    },
    template:
'<div class="flash flash-warn" ng-show="isVisible()">' +
  '<div class="close octicon octicon-x" ng-click="hideForm()"></div>' +
  'You have not entered your GitHub application credentials to be stored in localStorage.<br/>' +
    '<em>You can generate these credentials here: ' +
    '<a target="_blank" href="https://github.com/settings/applications/new">Register Github Application</a>' +
  '</em><br/>' +
    '<strong>Be aware that this will permanently store your credentials in the browser\'s local storage. ' +
    'Do not do this if you are on an unsecure shared computer.</strong>' +
  '<dl class="form">' +
    '<dt><label>Client Id</label></dt><dd><input ng-model="client_id"></dd>' +
  '</dl>' +
  '<dl class="form">' +
    '<dt><label>Client Secret</label></dt><dd><input size="50" ng-model="client_secret"></dd>' +
  '</dl>' +
  '<dl class="form">' +
    '<p><button class="button primary" ng-click="storeCredentials()">Save Credentials</button></p>' +
  '</dl>' +
'</div>'
  };
}]);