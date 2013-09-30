describe('CSRF module', function() {
  describe('meta directive', function() {
    beforeEach(module('CSRF'));
    it('reads the CSRF meta tag and updates the default $http headers', inject(function($compile, $rootScope, $http) {
      $compile('<head><meta name="csrf-token" content="DUMMY_TOKEN_VALUE"></head>')($rootScope);
      $rootScope.$digest();
      expect($http.defaults.headers.put['X-CSRF-Token']).toEqual('DUMMY_TOKEN_VALUE');
      expect($http.defaults.headers.delete['X-CSRF-Token']).toEqual('DUMMY_TOKEN_VALUE');
    }));
  });
});