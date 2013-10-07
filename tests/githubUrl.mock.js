angular.module('githubUrl-mock', []).factory('githubUrl', function() {
  return {
    owner: 'angular',
    repos: 'angular.js',
    prNumber: '7654',
    getAPIUrl: function() { return 'https://api.github.com/repos/angular/angular.js'; }
  };
});
