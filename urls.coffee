songs_view   = require 'songs_view/songs_view'
{urlpattern} = require 'router/router'

module.exports = [
    urlpattern '.*', (url) -> songs_view.render_songs songs_view.get_query url
]
