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

  describe('API calls', function() {

    angular.module('mockGitHubUrl', []).factory('gitHubUrl', function() {
      return {
        owner: 'angular',
        repos: 'angular.js',
        prNumber: '7654',
        getAPIUrl: function() { return 'https://api.github.com/repos/angular/angular.js'; }
      };
    });

    beforeEach(module('mockGitHubUrl'));
    beforeEach(inject(function($httpBackend) {
      $httpBackend.whenGET('https://api.github.com/repos/angular/angular.js/labels').respond([
        { name: 'bug', url: 'label/bug' },
        { name: 'feature', url: 'label/feature' },
        { name: 'question', url: 'label/question' }
      ]);
      $httpBackend.whenGET('https://api.github.com/repos/angular/angular.js/issues/7654/labels').respond([
        { name: 'bug', url: 'label/bug' },
        { name: 'question', url: 'label/question' }
      ]);
      $httpBackend.whenPUT('https://github.com/angular/angular.js/issues/labels/modify_assignment').respond([]);
      $httpBackend.whenDELETE('https://github.com/angular/angular.js/issues/labels/modify_assignment').respond([]);
    }));


    describe('getLabelsFor service', function() {

      it('retrieves the labels for the given PR from the API', inject(function(getLabelsFor, $rootScope, $httpBackend) {
        $httpBackend.expectGET('https://api.github.com/repos/angular/angular.js/issues/7654/labels');

        $rootScope.$apply(function() {
          getLabelsFor(7654).then(function(labels) {
            expect(labels.length).toEqual(2);
            expect(labels[1].name).toEqual('question');
          });
        });
    
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));
    });


    describe('getAllLabels service', function() {

      it('retrieves all the labels from the API', inject(function(getAllLabels, $rootScope, $httpBackend) {
        $httpBackend.expectGET('https://api.github.com/repos/angular/angular.js/labels');

        $rootScope.$apply(function() {
          getAllLabels().then(function(labels) {
            expect(labels.length).toEqual(3);
            expect(labels[1].name).toEqual('feature');
          });
        });
    
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));
    });


    describe('getCheckedLabelsFor service', function() {

      it('retrieves all the labels from the API and marks the ones that are on the given PR', inject(function(getCheckedLabelsFor, $rootScope, $httpBackend) {
        $httpBackend.expectGET('https://api.github.com/repos/angular/angular.js/labels');
        $httpBackend.expectGET('https://api.github.com/repos/angular/angular.js/issues/7654/labels');

        $rootScope.$apply(function() {
          getCheckedLabelsFor(7654).then(function(labels) {
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

      it('sends a PUT request if the label is checked', inject(function(updateLabel, $httpBackend, $rootScope) {
        $httpBackend.expectPUT('https://github.com/angular/angular.js/issues/labels/modify_assignment');
        $rootScope.$apply(function() {
          updateLabel({ 'name': 'bug', checked: true });
        });
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));


      it('sends a DELETE request if the label is checked', inject(function(updateLabel, $httpBackend, $rootScope) {
        $httpBackend.expectDELETE('https://github.com/angular/angular.js/issues/labels/modify_assignment');
        $rootScope.$apply(function() {
          updateLabel({ 'name': 'bug' });
        });
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
      }));
    });
  });

  describe("brightness service", function() {
    it('returns the brightness of a colour', inject(function(brightness) {
      expect(brightness('FFFFFF')).toEqual(255);
      expect(brightness('000000')).toEqual(0);
      expect(brightness('FF0000')).toEqual(76.245);
      expect(brightness('00FF00')).toEqual(149.685);
      expect(brightness('0000FF')).toEqual(29.07);
    }));
  });

  describe("ghLabel directive", function() {
    it('creates markup to display a specified label', inject(function($compile, $rootScope) {
      $rootScope.testLabel = {
        name: 'bug',
        color: 'FF0000'
      };
      var element = $compile('<gh-label label="testLabel"></gh-label>')($rootScope);
      expect(element.css('background-color')).toEqual('rgb(255, 0, 0)');
      expect(element.css('color')).toEqual('white');
      expect(element.hasClass('lighter')).toBeTruthy();
    }));
  });
});