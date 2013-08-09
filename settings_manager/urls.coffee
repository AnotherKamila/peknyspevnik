{ urlpattern } = require 'router/router'

module.exports = [
    urlpattern '^/$', -> document.body.innerText = 'settings screen'
    urlpattern '.*', (url) -> document.body.innerText = "settings, section #{url.substring 0,url.length-1}"
]
