# Shipscope

This is a modified version of the Shipscope Chrome browser extension, whose original version can be found [here](https://github.com/codeship/shipscope). The extension monitors your projects on [Codeship](https://codeship.com) and provides the following features:

* Shipscope presents a popup containing all of your projects.
* The status of each project’s master branch is indicated next to the project name. 
* Clicking a project shows you the last 10 builds for that project.
* Each build’s status is displayed in the build list.
* If a build is running, you see a little spinny thing. That never gets boring.
* If a build has completed, you can restart it and get that spinny thing going again!

The original can be installed from the [Chrome Web Store](https://chrome.google.com/webstore/detail/shipscope/jdedmgopefelimgjceagffkeeiknclhh?hl=en).

---

# In This Version

## Silence Unnecessary Notifications

The current production version of Shipscope does not allow users to select which projects they would like to receive notifications for—meaning that the extension can be noisy (to the point of unusability) for large teams with multiple engineers submitting builds. I've modified the original extension so that the user can specify a specific Project ID, effectively ignoring builds from projects other than the one specified.

## Project Feedback Reflects Most Recent Build

The current production version of Shipscope also calculates the status of each project based (largely) on the state of the master branch in that project. My preference was to highlight the status of the most recent build instead, so I modified (somewhat hackily) the feedback in that direction.


### Prerequisites

* node
* npm
* grunt

### Steps

1. Ensure that all of the prerequisites are installed!! Ensure that typing `grunt --version` works.
1. Clone this repository
1. `npm install`
1. `grunt build`
1. Open the Chrome Extension Manager at chrome://extensions
1. Check the **Developer mode** box
1. Click **Load unpacked extension**
1. Select the folder containing: `codeship/app`

The Shipscope icon should appear in your menu bar.

## License

Copyright (c) 2014 David McGaffin

see [LICENSE](https://github.com/codeship/shipscope/blob/master/LICENSE)
