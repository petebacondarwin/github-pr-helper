describe('prDetailView', function() {

  beforeEach(module('prDetailView'));

  describe("discussionSidebar", function() {

    it('appends a label list to the end of the current element', inject(function($compile, $rootScope) {
      var element = angular.element('<div class="discussion-sidebar"><div>Static Content</div></div>');
      $compile(element)($rootScope);

      expect(element.children().length).toBe(2);
      expect(element.children().eq(1).hasClass('discussion-labels')).toBeTruthy();
    }));
    
    it('gets labels from github and adds them to the scope', inject(function($compile, $rootScope, githubAPI, $q) {
      spyOn(githubAPI, 'getCheckedLabels').andReturn( $q.when([ {name: 'label1'} ]) );
      var element = angular.element('<div class="discussion-sidebar"><div>Static Content</div></div>');
      
      $compile(element)($rootScope);
      $rootScope.$digest();

      expect(element.scope().labels).toBeDefined();
    }));
  });

  describe('labelManager directive', function() {

    
  });
});