{urlpattern} = require './router/router.coffee'

module.exports = [
    urlpattern '_add', (require './songs/ui/add_song.coffee').handler
    urlpattern '.*',   (require './songs/ui/show.coffee').handler
]
