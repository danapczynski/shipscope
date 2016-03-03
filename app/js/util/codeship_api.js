var CodeshipApi = (function() {
  var
    API_HOST = "https://codeship.com/api",
    ALL_PROJECTS_URL = API_HOST + "/v2/projects.json",
    SINGLE_PROJECT_URL = API_HOST + "/v1/projects/"
    BUILD_URL = API_HOST + "/v1/builds.json",

    fetchAll = function(options, callback) {
      fetchProjects(options, function(projects, error) {
        if (error) {
          callback(null, error)
          return
        }

        async.each(projects.models, function(project, done) {
            fetchBuilds(options, project, function(builds) {
              project.set({builds: builds});
              done()
            })
          }, function(error) {
            if (error) {
              callback(null, error)
            } else {
              callback(projects)
            }
          })
      })
    },

    fetchBuilds = function(options, project, callback) {
      var params = 'api_key=' + options.api_key + "&project_id=" + project.id

      $.getJSON(BUILD_URL, params)
        .done( function(response) {
          buildsCollection = new Builds(response.builds)
          callback(buildsCollection)
        })
        .fail(function(err) {
          console.error(err)
          ga('send', 'event', 'background', 'fetch_builds', 'error')
        });
    },

    fetchProjects = function(options, callback) {
      if (options && options.api_key != undefined) {
        var params = 'api_key=' + options.api_key
        $.getJSON(projectUrl(options), params)
          .done( function(response) {
            var response_projects
            if (options.project_id) {
              response_projects = [response]
            } else {
              response_projects = response.projects
            }
            projectsCollection = new Projects(response_projects)
            callback(projectsCollection)
          })
          .fail(function(err) {
            ga('send', 'event', 'background', 'fetch_projects', 'error')
            callback(null, {type: 'error', data: err})
          });
      }
    },

    projectUrl = function(options) {
      var url
      if (options.project_id) {
        url = (SINGLE_PROJECT_URL + options.project_id + ".json")
      } else {
        url = ALL_PROJECTS_URL
      }
      return url
    }

  return {
    fetchAll: fetchAll,
    fetchBuilds: fetchBuilds,
    fetchProjects: fetchProjects
  }
});
