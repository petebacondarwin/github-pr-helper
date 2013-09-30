describe('labels module', function() {

  beforeEach(module('labels'));

  describe('gitHubUrl service', function() {

    describe('with a PR list page', function() {
      var locationSpy;
      beforeEach(inject(function($location) {
        locationSpy = spyOn($location, 'absUrl').andReturn('https://github.com/angular/angular.js/pulls');
      }));
      it('parses the url correctly', inject(function(gitHubUrl) {
        expect(locationSpy).toHaveBeenCalled();
        expect(gitHubUrl.owner).toEqual('angular');
        expect(gitHubUrl.repos).toEqual('angular.js');
        expect(gitHubUrl.prNumber).toBeUndefined();
      }));
    });


    describe('with a PR detail page', function() {
      var locationSpy;
      beforeEach(inject(function($location) {
        locationSpy = spyOn($location, 'absUrl').andReturn('https://github.com/angular/angular.js/pull/4126');
      }));
      it('parses the url correctly', inject(function(gitHubUrl) {
        expect(locationSpy).toHaveBeenCalled();
        expect(gitHubUrl.owner).toEqual('angular');
        expect(gitHubUrl.repos).toEqual('angular.js');
        expect(gitHubUrl.prNumber).toEqual('4126');
      }));
    });


    describe('getAPIUrl function', function() {
      beforeEach(inject(function($location) {
        spyOn($location, 'absUrl').andReturn('https://github.com/angular/angular.js/pulls');
      }));
      it('returns the correct API url', inject(function(gitHubUrl) {
        expect(gitHubUrl.getAPIUrl()).toEqual('https://api.github.com/repos/angular/angular.js');
      }));
    });

  });
});