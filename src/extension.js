(function() {
  // Define the primary extension module
  angular.module('extension', ['terminateCompilation', 'listGroupItems', 'prDetailView']);

  // Bootstrap the application
  angular.bootstrap(document, ['extension']);

})();