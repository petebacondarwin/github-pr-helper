describe('labels module', function() {
  beforeEach(module('labels'));

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