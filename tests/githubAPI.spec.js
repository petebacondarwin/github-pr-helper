describe('githubAPI module', function() {

  beforeEach(module('githubAPI'));

  describe('githubUrl service', function() {

    describe('with a PR list page', function() {
      var locationSpy;
      beforeEach(inject(function($location) {
        locationSpy = spyOn($location, 'absUrl').andReturn('https://github.com/angular/angular.js/pulls');
      }));
      it('parses the url correctly', inject(function(githubUrl) {
        expect(locationSpy).toHaveBeenCalled();
        expect(githubUrl.owner).toEqual('angular');
        expect(githubUrl.repos).toEqual('angular.js');
        expect(githubUrl.prNumber).toBeUndefined();
      }));
    });


    describe('with a PR detail page', function() {
      var locationSpy;
      beforeEach(inject(function($location) {
        locationSpy = spyOn($location, 'absUrl').andReturn('https://github.com/angular/angular.js/pull/4126');
      }));
      it('parses the url correctly', inject(function(githubUrl) {
        expect(locationSpy).toHaveBeenCalled();
        expect(githubUrl.owner).toEqual('angular');
        expect(githubUrl.repos).toEqual('angular.js');
        expect(githubUrl.prNumber).toEqual('4126');
      }));
    });


    describe('getAPIUrl function', function() {
      beforeEach(inject(function($location) {
        spyOn($location, 'absUrl').andReturn('https://github.com/angular/angular.js/pulls');
      }));
      it('returns the correct API url', inject(function(githubUrl) {
        expect(githubUrl.getAPIUrl()).toEqual('https://api.github.com/repos/angular/angular.js');
      }));
    });

  });

  describe('API calls', function() {

    beforeEach(module('githubUrl-mock'));
    beforeEach(inject(function($httpBackend) {
      $httpBackend.whenGET('https://api.github.com/repos/angular/angular.js/labels').respond([
        { name: 'bug', url: 'label/bug' },
        { name: 'feature', url: 'label/feature' },
        { name: 'question', url: 'label/question' }
      ]);
      $httpBackend.whenGET('https://api.github.com/repos/angular/angular.js/issues/7654').respond({
        labels: [
          { name: 'bug', url: 'label/bug' },
          { name: 'question', url: 'label/question' }
        ]
      });
      $httpBackend.whenPUT('https://github.com/angular/angular.js/issues/labels/modify_assignment').respond([]);
      $httpBackend.whenDELETE('https://github.com/angular/angular.js/issues/labels/modify_assignment').respond([]);
    }));


    describe('getIssue service', function() {

      it('retrieves the info for the given Issue/PR from the API', inject(function(githubAPI, $rootScope, $httpBackend) {
        $httpBackend.expectGET('https://api.github.com/repos/angular/angular.js/issues/7654');

        $rootScope.$apply(function() {
          githubAPI.getIssue(7654).then(function(issue) {
            expect(issue.labels.length).toEqual(2);
            expect(issue.labels[1].name).toEqual('question');
          });
        });
    
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));
    });


    describe('getAllLabels service', function() {

      it('retrieves all the labels from the API', inject(function(githubAPI, $rootScope, $httpBackend) {
        $httpBackend.expectGET('https://api.github.com/repos/angular/angular.js/labels');

        $rootScope.$apply(function() {
          githubAPI.getAllLabels().then(function(labels) {
            expect(labels.length).toEqual(3);
            expect(labels[1].name).toEqual('feature');
          });
        });
    
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));
    });


    describe('getCheckedLabels service', function() {

      it('retrieves all the labels from the API and marks the ones that are on the given PR', inject(function(githubAPI, githubUrl, $rootScope, $httpBackend) {
        $httpBackend.expectGET('https://api.github.com/repos/angular/angular.js/labels');
        $httpBackend.expectGET('https://api.github.com/repos/angular/angular.js/issues/7654');

        githubUrl.prNumber = 7654;

        $rootScope.$apply(function() {
          githubAPI.getCheckedLabels().then(function(labels) {
            expect(labels.length).toEqual(3);
            expect(labels[0].checked).toBeTruthy();
            expect(labels[1].checked).not.toBeTruthy();
            expect(labels[2].checked).toBeTruthy();
          });
        });
    
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));
    });


    describe("updateLabel service", function() {

      it('sends a PUT request if the label is checked', inject(function(githubAPI, $httpBackend, $rootScope) {
        $httpBackend.expectPUT('https://github.com/angular/angular.js/issues/labels/modify_assignment');
        $rootScope.$apply(function() {
          githubAPI.updateLabel({ 'name': 'bug', checked: true });
        });
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));


      it('sends a DELETE request if the label is checked', inject(function(githubAPI, $httpBackend, $rootScope) {
        $httpBackend.expectDELETE('https://github.com/angular/angular.js/issues/labels/modify_assignment');
        $rootScope.$apply(function() {
          githubAPI.updateLabel({ 'name': 'bug' });
        });
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));
    });
  });
});