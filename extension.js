(function() {
  angular.module('extension', ['listGroupItems', 'discussionSidebar']);

  // Bootstrap the application
  var container = angular.element(document.getElementsByClassName('container'));
  angular.bootstrap(container, ['extension']);

})();