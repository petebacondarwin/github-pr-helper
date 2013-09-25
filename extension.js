(function() {
  angular.module('extension', ['listGroupItems', 'discussionSidebar']);

  // Bootstrap the application
  var pullList = angular.element(document.getElementsByClassName('container'));
  console.log(pullList);
  angular.bootstrap(pullList, ['extension']);

})();