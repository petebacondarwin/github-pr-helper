describe('flashMessages module', function() {

  beforeEach(module('flashMessages'));

  describe('flashMessages directive', function() {
    beforeEach(inject(function(flashMessages) {
      // Clear out the flash messages before each test
      flashMessages.length = 0;
    }));

    it('repeats over the messages in flash messages', inject(function($compile, $rootScope, flashMessages) {
      var element = $compile('<div class="flash-messages"></div>')($rootScope);
      expect(element.children().length).toEqual(0);
      flashMessages.push({ text: "hello", type: "warn"});
      $rootScope.$digest();
      expect(element.children().length).toEqual(1);
    }));

    it('removes the message if the div.close is clicked', inject(function($compile, $rootScope, flashMessages) {
      var element = $compile('<div class="flash-messages"></div>')($rootScope);
      flashMessages.push({ text: "hello", type: "warn"});
      $rootScope.$digest();
      var closeElement = element[0].getElementsByClassName('close');
      closeElement[0].click();
      expect(element.children().length).toEqual(0);
    }));
  });

});