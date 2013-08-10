songs_view   = require './songs_view/songs_view.coffee'
{urlpattern} = require './router/router.coffee'

module.exports = [
    urlpattern '.*', (url) -> songs_view.render_songs songs_view.get_query url
]
