(function() {
  // Define the primary extension module
  angular.module('extension', ['terminateCompilation', 'flashMessages', 'listGroupItems', 'prDetailView']);

  // Bootstrap the application
  angular.bootstrap(document, ['extension']);

})();