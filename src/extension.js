(function() {
  // Define the primary extension module
  angular.module('extension', ['githubHacks', 'flashMessages', 'listGroupItems']);

  // Bootstrap the application
  angular.bootstrap(document, ['extension']);

})();