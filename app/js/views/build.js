var BuildView = Backbone.Marionette.ItemView.extend({
  tagName: 'a',
  className: 'list-group-item',
  template: '#build_item',
  modelEvents: {
    'change:status': 'onStatusChange'
  },

  templateHelpers: function() {
    return {
      getStatusIcon: function() {
        var STATES = {
          stopped: 'warning',
          success: 'success',
          error: 'danger',
          testing: 'info',
          blocked: 'danger',
          infrastructure_failure: 'danger',
        }
        return STATES[this.status];
      },
      projectId: this.projectId,
      repositoryName: this.repositoryName
    }
  },

  initialize: function(options) {
    this.projectId = options.projectId
    this.repositoryName = options.repositoryName
  },

  onStatusChange: function() {
    this.render();
  }
});
