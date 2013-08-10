settings_manager_urls = require 'settings_manager/urls'
songs_view            = require 'songs_view/songs_view'

{ urlpattern } = require 'router/router'

module.exports = [
    urlpattern '^settings/', settings_manager_urls
    urlpattern '.*', (url) -> songs_view.render_songs songs_view.get_query url
]
