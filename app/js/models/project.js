var Project = Backbone.Model.extend({
  tagName: 'li',

  getStatus: function() {
    var
      builds = this.attributes.builds,
      projectStatus = Build.STATES.success,
      hasRunningBuild,
      lastMasterBuild,
      mostRecentBuild;

    // we lose the backbone collection,
    // init builds collection after passing to the frontend
    if (Array.isArray(builds)) {
      builds = new Builds(builds)
    }

    if (typeof builds !== "undefined" && builds !== null && builds.length > 0) {
      hasRunningBuild = builds.findWhere({status: 'testing'})
      if (hasRunningBuild) {
        projectStatus = Build.STATES.testing
      } else {
        // Un-comment the below if it is preferable for the project status
        // to reflect the state of the 'master' branch
        //
        // lastMasterBuild = builds.findWhere({branch: 'master'})
        // if (lastMasterBuild) {
        //   projectStatus = lastMasterBuild.getStatus()
        // }
        mostRecentBuild = builds.sort().first();
        if (mostRecentBuild) {
          projectStatus = mostRecentBuild.getStatus()
        }
      }
    }

    return {
      status: projectStatus
    }
  },
});
