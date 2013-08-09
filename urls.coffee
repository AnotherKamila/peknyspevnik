settings_manager_urls = require 'settings_manager/urls'
# songs_view_render_url = require 'songs_view/render_url'

{ urlpattern } = require 'router/router'

module.exports = [
    urlpattern '^settings/', settings_manager_urls
]
