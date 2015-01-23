var OptionsModel = Backbone.Model.extend({
  defaults: {
    api_key: '',
    projects: []
  },

  isEmptyApiKey: function() {
    var api_key = this.attributes.api_key
    return api_key != null && api_key.trim() == ''
  }
});
