# GitHub PR Helper (deprecated)

**Due to recent improvements to the GitHub UI this helper is probably no longer needed.**

**I will not be actively developing or supporting this project going forward**

A Chrome Extension to make the Pull Request view on GitHub nicer
(no unicorns were harmed to make this extension)

Features include:
- Display labels on PR list pages
- Display labels on PR detail pages (removed as GitHub does this now)
- Manage PR labels on PR detail pages (removed as Github does this now)
- Milestones shown on PR list pages

** Note that as of v0.2.0 the extension uses "*Personal Access Tokens*" to authenticate rather than
"*GitHub Application Credentials*", which it previously used.  Tokens are easier to generate and, more
importantly, allow the extension to work with private repositories.

## Install

Install from the Chrome Web Store:
https://chrome.google.com/webstore/detail/github-pr-helper/mokbklfnaddkkbolfldepnkfmanfhpen. You'll
now need to authorize yourself, see Github API request limiting, below.

## Github API request limiting

The extension makes calls to https://api.github.com.  This has a limit of 60 requests per hour for
unauthenticated clients.  To get around this the extension will check for a property in the browser's
local storage.  You can check this by opening the console and typing:
```
localStorage.getItem('github.access_token');
```

If this is there then the extension will use this to authenticate its requests to GitHub, removing the
request limit and also allowing you to update the labels on PRs.

You get an access token from your GitHub account pages.
* go to the **Create a new Personal Access Token page**: https://github.com/settings/tokens/new
* login with your GitHub credentials.
* give the token a name

You can manually add your `access_token` to your localStorage:
* navigate to any GitHub page (such as http://github.com/angular/angular.js)
* open the Chrome developer console
* enter the following JavaScript, replacing the .... with your access token:

```
localStorage.setItem('github.access_token', "....");
```

Alternatively, when the extension realises that you are not authenticated and have over-run the
request limit, it will display a form, where you can enter your `access_token` directly.

## Known Issues

GitHub sometimes uses partial reloads to update the page more efficiently.  For instance, when you
filter the list of PRs by author.  When this happens this extension does not recognise it and so
you lose the list of labels.  Generally, the extension does not play well with any external changes
to the HTML in the page, which could also lead to memory leakage. This needs to be sorted out at
some point.  **The workaround is simply to refresh the page**.


## Manual Install (for development and testing)

If you intend to work on the development of the extension, you can install it manually:

Clone the repository:

```
git clone https://github.com/petebacondarwin/github-pr-helper.git
```

Open up the Chrome Extensions page:

```
chrome://extensions
```

Make sure the "Developer Mode" checkbox is ticked.

Click the "Load unpacked extension..." button and browse to the folder where you cloned this
repository.

Make sure that the extension is enabled and then browse to your favourite Pull Request list, say
https://github.com/angular/angular.js/pulls

## Testing
The tests are stored in the `/tests` folder and are written in Jasmine, using the ngMocks extensions
to AngularJS.  You run the tests using the [Karma Test Runner](http://karma-runner.github.io/).

### Install Karma
This project uses karma 0.10.x release. Get the karma utility from npm:

```
npm install karma
```
### Run the tests
The configuration is in the `karma.conf.js` file.  Run the tests with the karma utility:

```
karma start
```

This should open up a browser and then run the tests.
