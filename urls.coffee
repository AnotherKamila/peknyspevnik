{urlpattern, redirect} = require './router/router.coffee'
songs    = require './songs/songs.coffee'

module.exports = [
    urlpattern '.*', (url) -> songs.render_url url
]
