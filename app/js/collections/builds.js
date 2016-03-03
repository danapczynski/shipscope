var Builds = Backbone.Collection.extend({
  model: Build,
  comparator: function(build) {
    if (build.getStatus() == Build.STATES.testing) {
      build.getStartedAt() - 1000000
    }
    return build.getStartedAt()
  }
});
