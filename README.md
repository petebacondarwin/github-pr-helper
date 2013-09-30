# GitHub PR Helper

A Chrome Extension to make the Pull Request view on GitHub nicer
(no unicorns were harmed to make this extension)

Features include:
- Labels on PR list pages
- Labels on PR detail pages

## Install
For the time being, the extension is not available in the Chrome store, so instead install it
manually:

```
git clone https://github.com/petebacondarwin/github-pr-helper.git
```

Now open up the Chrome Extensions page:

```
chrome://extensions
```

Make sure the "Developer Mode" checkbox is ticked.

Now click the "Load unpacked extension..." button and browse to the folder where you cloned this
repository.

Make sure that the extension is enabled and then browse to your favourite Pull Request list, say
https://github.com/angular/angular.js/pulls

## Testing
The tests are stored in the `/tests` folder and are written in Jasmine, using the ngMocks extensions
to AngularJS.  You run the tests using the [Karma Test Runner](http://karma-runner.github.io/0.10/).

### Install Karma
This project uses karma 0.10.x release. Get the karma utility from npm:

```
npm install -g karma@0.10.x
```
### Run the tests
The configuration is in the `karma.conf.js` file.  Run the tests with the karma utility:

```
karma start
```

This should open up a browser and then run the tests.