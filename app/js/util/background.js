var Background = function() {
  var
    PROJECTS_POLLING_INTERVAL = (5 * 60000), // check list of projects every 5 minutes
    ANALYTICS_INTERVAL = 60000,
    api = new CodeshipApi(),

    buildWatcher,
    pollingInterval,
    options,
    projects = new Projects(),
    intercom,

    initIntercom = function() {
      chrome.runtime.onConnect.addListener(function(port) {
        if (intercom) {
          intercom.disconnect()
          intercom = null
        }

        intercom = port
        intercom.onDisconnect.addListener(function() {
          intercom = null
        })

        intercom.onMessage.addListener(function(msg) {
          if (msg.type == 'options.set') {
            options = msg.data
            chrome.storage.sync.set(options, function() {
              if (chrome.runtime.lastError) {
                console.error('ERROR setting options:', options, '=>', chrome.runtime.lastError.message)
              }
            })
            if (options && options.api_key) {
              fetchProjectsFromCodeship()
            }
            return
          }

          if (msg.type == 'options.get') {
            intercom.postMessage({type: 'options.set', data: options})
          }

          if (msg.type == 'projects.get') {
            if (projects != null && projects.length > 0) {
              intercom.postMessage({type: 'projects.set', data: projects})
            } else {
              intercom.postMessage({type: 'projects.set', data: projects})
              fetchProjectsFromCodeship()
            }
            return
          }
        })
      })
    },

    fetchOptionsFromLocalStorage = function(done) {
      chrome.storage.sync.get(null, function(value) {
        options = value
        done()
      })
    },

    fetchProjectsFromCodeship = function(done) {
      api.fetchAll(options, function(_projects, error) {
        if (error) {
          if (intercom) intercom.postMessage(error)
          return
        } else {
          if (intercom) {
            intercom.postMessage({type: 'api_ok'})
            intercom.postMessage({type: 'projects.set', data: _projects})
          }
        }

        projects.reset(_projects.models)
        buildWatcher.scan(projects)
        if (done) done()
      })
    },

    initializePolling = function() {
      setInterval(function() {
        ga('send', 'event', 'background', 'active_user', 'ping')
      }, ANALYTICS_INTERVAL)

      setInterval(fetchProjectsFromCodeship, PROJECTS_POLLING_INTERVAL)
    },

    initializeBuildWatcher = function(done) {
      buildWatcher = new BuildWatcher(options, api)
      done()
    }

  return {
    initialize: function() {
      initIntercom()
      initializePolling()
      async.series([
        fetchOptionsFromLocalStorage,
        initializeBuildWatcher,
        fetchProjectsFromCodeship
      ])
    }
  }
}

var background = new Background()
background.initialize()
